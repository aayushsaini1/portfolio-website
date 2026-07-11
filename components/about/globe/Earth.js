"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVector3 } from '../../../lib/space/interpolation';

const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform vec3 color;
    uniform float opacityMultiplier;
    void main() {
      // Glow intensity increases near the edge of the sphere
      float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
      gl_FragColor = vec4(color, 1.0) * intensity * opacityMultiplier;
    }
  `
};

export default function Earth({ globeRadius, setFocusedId, children }) {
  const earthRef = useRef();
  const instancedMeshRef = useRef();
  const [points, setPoints] = useState([]);
  const [lineSegments, setLineSegments] = useState(new Float32Array(0));
  const [isDark, setIsDark] = useState(true);

  // Detect and track the active theme (light/dark) reactively from the HTML document class list
  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    // Initial check
    checkTheme();

    // Set up MutationObserver to watch for theme toggle changes on <html>
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Very slow constant rotation (reduced by 75%)
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0075 * delta;
    }
  });

  // Load and sample the earth landmass image
  useEffect(() => {
    const img = new Image();
    img.src = '/earth-water.webp';
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Downsample to 180x90 for clean dot spacing
      const width = 180;
      const height = 90;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const imgData = ctx.getImageData(0, 0, width, height).data;
      const landPoints = [];

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Verify boundary limits to avoid seam artifacts
          if (x > 1 && x < width - 2 && y > 1 && y < height - 2) {
            const idx = (y * width + x) * 4;
            const r = imgData[idx];

            // Landmass threshold (r < 90) representing non-water pixels in the specular map
            if (r < 90) {
              const lat = 90 - (y / height) * 180;
              // Flip longitude direction (180 - ...) to correct mirroring
              const lon = 180 - (x / width) * 360;

              // Skip extreme polar tips (Math.abs(lat) < 85) to render polar landmasses fully
              if (Math.abs(lat) < 85) {
                landPoints.push({ lat, lon });
              }
            }
          }
        }
      }

      setPoints(landPoints);
    };

    img.onerror = (err) => {
      console.error('Failed to load earth-water map texture:', err);
    };
  }, []);

  // Compute neighboring landmass nodes to create the plexus line grid
  useEffect(() => {
    if (points.length === 0) return;

    const threshold = 0.125; // Connect nodes with distance < 0.125 units
    const coords = [];
    const points3D = points.map(pt => {
      const [x, y, z] = latLonToVector3(pt.lat, pt.lon, globeRadius);
      return new THREE.Vector3(x, y, z);
    });

    for (let i = 0; i < points3D.length; i++) {
      const pA = points3D[i];
      for (let j = i + 1; j < points3D.length; j++) {
        const pB = points3D[j];
        const dist = pA.distanceTo(pB);
        if (dist < threshold) {
          coords.push(pA.x, pA.y, pA.z);
          coords.push(pB.x, pB.y, pB.z);
        }
      }
    }

    setLineSegments(new Float32Array(coords));
  }, [points, globeRadius]);

  // Update instanced mesh matrices and colors reactively when points load or theme toggles
  useEffect(() => {
    if (!instancedMeshRef.current || points.length === 0) return;

    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();

    points.forEach((pt, i) => {
      // Position dots slightly elevated above the sphere
      const [x, y, z] = latLonToVector3(pt.lat, pt.lon, globeRadius * 1.002);
      dummy.position.set(x, y, z);

      // Orient the dot outwards
      dummy.lookAt(0, 0, 0);

      // Uniform dots representing nodes/vertices: larger in light mode for better contrast
      const dotSize = isDark ? 0.006 : 0.010;
      dummy.scale.set(dotSize, dotSize, dotSize);

      // Offset position outward slightly
      const radialDir = new THREE.Vector3(x, y, z).normalize();
      dummy.position.addScaledVector(radialDir, dotSize / 2);

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);

      // Dark mode: bright white/silver | Light mode: charcoal/dark slate
      tempColor.set(isDark ? '#f8fafc' : '#0f172a');
      instancedMeshRef.current.setColorAt(i, tempColor);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [points, globeRadius, isDark]);

  // Dot Geometry
  const dotGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const dotMaterial = useMemo(() => new THREE.MeshBasicMaterial({}), []);

  // Reactive shader uniforms based on the theme mode
  const atmosphereUniforms = useMemo(() => ({
    color: { value: new THREE.Color(isDark ? '#ddeefc' : '#070707') },
    opacityMultiplier: { value: isDark ? 0.45 : 0.1 }
  }), [isDark]);

  return (
    <group ref={earthRef}>
      {/* Base Earth Sphere - Resets focus when clicked */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocusedId(null);
        }}
      >
        <sphereGeometry args={[globeRadius, 64, 64]} />
        <meshBasicMaterial color={isDark ? "#000000" : "#ffffff"} />
      </mesh>

      {/* Latitude/Longitude background grid lines overlay */}
      <mesh>
        <sphereGeometry args={[globeRadius * 0.995, 18, 14]} />
        <meshBasicMaterial
          color={isDark ? "#334155" : "#cbd5e1"}
          wireframe={true}
          transparent={true}
          opacity={isDark ? 0.12 : 0.22}
          depthWrite={false}
        />
      </mesh>

      {/* Dotted Nodes/Vertices (Instanced) */}
      {points.length > 0 && (
        <instancedMesh
          ref={instancedMeshRef}
          args={[dotGeometry, dotMaterial, points.length]}
        />
      )}

      {/* Connected Constellation/Plexus lines */}
      {lineSegments.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[lineSegments, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isDark ? "#cbd5e1" : "#475569"} // Glowing silver/slate in dark mode, slate-slate in light mode
            transparent={true}
            opacity={isDark ? 0.18 : 0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Atmospheric Outer Glow Sphere */}
      <mesh scale={[1.16, 1.16, 1.16]}>
        <sphereGeometry args={[globeRadius, 32, 32]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* Render nested children (like location markers) so they rotate with the Earth */}
      {children}
    </group>
  );
}
