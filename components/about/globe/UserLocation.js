"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLonToVector3 } from '../../../lib/space/interpolation';

export default function UserLocation({ globeRadius, focusedId, setFocusedId }) {
  const markerRef = useRef();
  const pulseARef = useRef();
  const pulseBRef = useRef();
  const labelRef = useRef();
  const [isDark, setIsDark] = useState(true);

  // Detect and track the active theme (light/dark) reactively from the HTML document class list
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  // Bangalore, India Coordinates (longitude negated to match flipped landmass coordinate space, lat shifted upward)
  const lat = 18.5;
  const lon = -77.5946;

  // Convert to 3D Cartesian coordinates slightly elevated on the surface
  const position = useMemo(() => {
    const [x, y, z] = latLonToVector3(lat, lon, globeRadius * 1.002);
    return new THREE.Vector3(x, y, z);
  }, [globeRadius]);

  // Generate a procedural green glowing radar ring texture
  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Radial glow styling
    ctx.strokeStyle = '#22c55e'; // Green pulse
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22c55e';
    
    ctx.beginPath();
    ctx.arc(32, 32, 22, 0, Math.PI * 2);
    ctx.stroke();
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulse A: loops every 3.0 seconds (50% slower)
    const progressA = (time % 3.0) / 3.0;
    const scaleA = 0.01 + progressA * 0.25; // Expands outward
    const opacityA = 1.0 - progressA;       // Fades to transparent

    if (pulseARef.current) {
      pulseARef.current.scale.set(scaleA, scaleA, 1);
      pulseARef.current.material.opacity = opacityA;
    }

    // Pulse B: delayed by 1.5s (50% phase shift of 3s loop period)
    const progressB = ((time + 1.5) % 3.0) / 3.0;
    const scaleB = 0.01 + progressB * 0.25;
    const opacityB = 1.0 - progressB;

    if (pulseBRef.current) {
      pulseBRef.current.scale.set(scaleB, scaleB, 1);
      pulseBRef.current.material.opacity = opacityB;
    }

    // Toggle label visibility based on whether the marker is facing the camera
    if (labelRef.current && markerRef.current) {
      const worldPos = new THREE.Vector3();
      markerRef.current.getWorldPosition(worldPos);
      
      const toCam = state.camera.position.clone().normalize();
      const toObj = worldPos.normalize();
      const dotNorm = toCam.dot(toObj);

      // Show and fade in when the location is in the front hemisphere facing the camera
      if (dotNorm > 0.15) {
        labelRef.current.style.display = 'block';
        labelRef.current.style.opacity = Math.min(1, (dotNorm - 0.15) * 5);
      } else {
        labelRef.current.style.display = 'none';
        labelRef.current.style.opacity = 0;
      }
    }
  });

  return (
    <group position={position} name="user">
      {/* Green Core Marker Dot - triggers focus on click */}
      <mesh
        ref={markerRef}
        onClick={(e) => {
          e.stopPropagation();
          setFocusedId('user');
        }}
      >
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Pulsing Radar Ring A */}
      <sprite ref={pulseARef}>
        <spriteMaterial 
          map={ringTexture} 
          transparent={true} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Pulsing Radar Ring B */}
      <sprite ref={pulseBRef}>
        <spriteMaterial 
          map={ringTexture} 
          transparent={true} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Simple Grey/Black Label - Visible when facing the camera */}
      <Html distanceFactor={4} position={[0, 0.05, 0]} center>
        <div 
          ref={labelRef}
          style={{
            color: isDark ? '#94a3b8' : '#0f172a', // Grey in dark mode, black in light mode
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: 0,
            display: 'none',
            transition: 'opacity 0.2s ease',
            marginBottom: "20px"
          }}
        >
          Aayush's Location
        </div>
      </Html>
    </group>
  );
}
