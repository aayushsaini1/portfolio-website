"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useISS from '../../../hooks/useISS';

export default function ISS({ globeRadius, focusedId, setFocusedId }) {
  // Get live ISS position target from the 5s polling hook
  const { position: targetPos } = useISS(globeRadius);
  
  const issRef = useRef();
  const labelRef = useRef();
  const currentPos = useRef(new THREE.Vector3(0, globeRadius * 1.045, 0));
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

  // Initialize position when first data arrives
  useEffect(() => {
    if (targetPos) {
      currentPos.current.set(targetPos[0], targetPos[1], targetPos[2]);
    }
  }, [targetPos]);

  useFrame((state, delta) => {
    if (!targetPos) return;

    // Smoothly interpolate towards the live API position target (updates every 5s)
    const targetVec = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    const factor = Math.min(1, 1.8 * delta);
    currentPos.current.lerp(targetVec, factor);

    // Update ISS model position and orientation
    if (issRef.current) {
      issRef.current.position.copy(currentPos.current);
      issRef.current.lookAt(0, 0, 0);
    }

    // Toggle label visibility based on whether the ISS is facing the camera
    if (labelRef.current && issRef.current) {
      const toCam = state.camera.position.clone().normalize();
      const toObj = currentPos.current.clone().normalize();
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

  // Generate a procedural radial gradient canvas texture for the soft halo glow
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Radial gradient: white-hot center fading to orange, then transparent
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(249, 115, 22, 1)'); // ISS Orange color
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  if (!targetPos) return null;

  return (
    <group>
      {/* ISS Glowing Sphere Model */}
      <group ref={issRef} name="iss">
        {/* Core solid sphere with raycast click handler for focus */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            setFocusedId('iss');
          }}
        >
          <sphereGeometry args={[0.033, 16, 16]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        
        {/* Soft, smooth glowing halo sprite */}
        <sprite scale={[0.20, 0.20, 1]}>
          <spriteMaterial 
            map={glowTexture} 
            blending={THREE.AdditiveBlending}
            transparent={true}
            depthWrite={false}
          />
        </sprite>

        {/* Simple Grey/Black Focus Label - Visible when facing the camera */}
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
              marginBottom: '20px'
            }}
          >
            Intenational Space Station
          </div>
        </Html>
      </group>
    </group>
  );
}
