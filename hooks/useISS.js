import { useState, useEffect, useRef } from 'react';
import { fetchISSLocation } from '../lib/space/iss';
import { latLonToVector3 } from '../lib/space/interpolation';

/**
 * Custom hook to track the live position of the ISS, converted to 3D coordinates.
 * Polls the ISS API, handles page visibility changes, and manages fetch states.
 * 
 * @param {number} globeRadius - The radius of the 3D earth globe.
 * @returns {{ position: [number, number, number] | null, rawData: any, error: any }}
 */
export default function useISS(globeRadius) {
  const [position, setPosition] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  
  const isVisibleRef = useRef(true);
  const intervalRef = useRef(null);

  // Helper to fetch position and update state
  const updatePosition = async () => {
    if (!isVisibleRef.current) return;
    
    try {
      const data = await fetchISSLocation();
      setRawData(data);
      
      // The ISS orbits at roughly 420km. Let's scale its height relative to Earth (6371km radius)
      // ISS Height scale factor: 420 / 6371 = ~0.066.
      // So orbit radius is globeRadius * 1.045
      const orbitRadius = globeRadius * 1.045;
      const pos3d = latLonToVector3(data.lat, -data.lon, orbitRadius);
      
      setPosition(pos3d);
      setError(null);
    } catch (err) {
      console.error('Failed to update ISS position:', err);
      setError(err);
    }
  };

  useEffect(() => {
    // Initial fetch
    updatePosition();

    // Visibility handlers to pause polling in inactive tabs
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      isVisibleRef.current = isVisible;
      
      if (isVisible) {
        // Fetch immediately on wake and reset interval
        updatePosition();
        resetInterval();
      } else {
        // Clear interval when page is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    const resetInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Poll every 5 seconds
      intervalRef.current = setInterval(updatePosition, 5000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    resetInterval();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [globeRadius]);

  return { position, rawData, error };
}
