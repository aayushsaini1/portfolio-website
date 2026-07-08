"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Earth from './Earth';
import ISS from './ISS';
import NEOs from './NEOs';
import UserLocation from './UserLocation';
import Camera from './Camera';

export default function Scene() {
  const globeRadius = 2.0;
  // Shared interactive focus state
  const [focusedId, setFocusedId] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 11.0], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Subtle lighting matching a dark space aesthetic */}
        <ambientLight intensity={0.15} />

        {/* Directional light acting as solar illumination */}
        <directionalLight
          position={[5, 3, 5]}
          intensity={1.2}
          color="#ffffff"
        />

        {/* A subtle colored backlight to make the atmospheric glow feel deeper */}
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.4}
          color="#3b82f6"
        />

        {/* Globe base sphere and landmass dots */}
        <Earth globeRadius={globeRadius} setFocusedId={setFocusedId}>
          {/* User Current Location Dot (Bangalore, India) */}
          <UserLocation
            globeRadius={globeRadius}
            focusedId={focusedId}
            setFocusedId={setFocusedId}
          />
        </Earth>

        {/* Live ISS tracker and orbit path */}
        <ISS
          globeRadius={globeRadius}
          focusedId={focusedId}
          setFocusedId={setFocusedId}
        />

        {/* NASA Near Earth Objects */}
        <NEOs
          globeRadius={globeRadius}
          focusedId={focusedId}
          setFocusedId={setFocusedId}
        />

        {/* Orbit controls with auto-rotation and interactive tracking focus */}
        <Camera globeRadius={globeRadius} focusedId={focusedId} />
      </Canvas>
    </div>
  );
}
