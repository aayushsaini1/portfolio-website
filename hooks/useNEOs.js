import { useState, useEffect } from 'react';
import { fetchNearEarthObjects } from '../lib/space/nasa';

// Simple in-memory cache to prevent multiple fetches during hot-reloads
let cachedNEOs = null;

/**
 * Custom hook to fetch Near Earth Objects and calculate their orbital paths.
 * 
 * @param {number} globeRadius - The radius of the 3D earth globe.
 * @returns {{ neos: Array<any>, loading: boolean, error: any }}
 */
export default function useNEOs(globeRadius) {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadNEOs = async () => {
      try {
        let rawList = cachedNEOs;
        if (!rawList) {
          rawList = await fetchNearEarthObjects();
          cachedNEOs = rawList;
        }

        if (!active) return;

        // Distribute asteroids deterministically based on their parameters
        const orbitalNEOs = rawList.map((neo, index) => {
          // Use deterministic math so orbits don't jump around on state reload
          const seed = hashCode(neo.id);
          
          // Radius: Scale based on miss distance, keeping it close to the earth (1.08x to 1.22x globe radius)
          // Normalizing: log scale is nice since miss distances vary from thousands to millions of km
          const normalizedDist = Math.min(1, Math.max(0, (Math.log10(neo.missDistanceKm) - 4) / 4)); // log10(10k) to log10(100M)
          const orbitRadius = globeRadius * (1.08 + normalizedDist * 0.14);

          // Inclination angle (radians): Tilt of orbit relative to equator (-60 to 60 deg)
          const inclination = (((seed % 100) / 100) * 120 - 60) * (Math.PI / 180);

          // Rotation around Y axis: Longitude of ascending node (0 to 360 deg)
          const nodeRotation = (((seed >> 2) % 100) / 100) * Math.PI * 2;

          // Orbit period/speed: Scaled relative velocity.
          // Higher velocity = faster orbit. Let's make orbital speed vary between 0.05 and 0.2 rad/sec
          const speed = 0.05 + ((neo.velocityKmh % 40000) / 40000) * 0.15;

          // Size: scale of the asteroid mesh (reduced by another 50% to range 0.004 to 0.008, keeping them smaller than ISS)
          const sizeScale = 0.004 + Math.min(1, Math.sqrt(neo.diameterKm)) * 0.004;

          // Start position phase angle (0 to 360 deg)
          const startPhase = (((seed >> 4) % 100) / 100) * Math.PI * 2;

          return {
            ...neo,
            orbitRadius,
            inclination,
            nodeRotation,
            speed,
            sizeScale,
            startPhase,
            color: index % 2 === 0 ? '#0ea5e9' : '#3b82f6' // Glowing cyber blue colors
          };
        });

        setNeos(orbitalNEOs);
        setLoading(false);
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadNEOs();

    return () => {
      active = false;
    };
  }, [globeRadius]);

  return { neos, loading, error };
}

// Simple string hash function for deterministic seeding
function hashCode(str) {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
