"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function Camera({ globeRadius, focusedId }) {
  const controlsRef = useRef();
  const [autoRotate, setAutoRotate] = useState(true);
  const timeoutRef = useRef(null);

  const handleStart = () => {
    // Stop auto-rotation during direct user interaction
    setAutoRotate(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Resume auto-rotation after 6 seconds of user inactivity
    timeoutRef.current = setTimeout(() => {
      setAutoRotate(true);
    }, 6000);
  };

  // Smoothly track the focused object or return back to the Earth's center
  useFrame((state) => {
    if (controlsRef.current) {
      if (focusedId) {
        const targetObj = state.scene.getObjectByName(focusedId);
        if (targetObj) {
          const targetWorldPos = new THREE.Vector3();
          targetObj.getWorldPosition(targetWorldPos);
          
          // Lerp control target to the focused object's position
          controlsRef.current.target.lerp(targetWorldPos, 0.08);
        }
      } else {
        // Return camera target back to center of Earth
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.08);
      }
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      minDistance={globeRadius * 1.6}
      maxDistance={globeRadius * 8.0}
      autoRotate={autoRotate && !focusedId} // Turn off auto-rotation when focusing on an object
      autoRotateSpeed={0.125} // Very slow, elegant rotation (reduced by 75%)
      onStart={handleStart}
      onEnd={handleEnd}
    />
  );
}
