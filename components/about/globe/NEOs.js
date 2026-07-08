"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import useNEOs from '../../../hooks/useNEOs';

function SingleNEO({ neo, globeRadius, focusedId, setFocusedId }) {
  const { id, name, sizeScale: rawSizeScale, color, speed, startPhase, inclination, nodeRotation, orbitRadius } = neo;
  const sizeScale = rawSizeScale * 2.0; // Double the size of NEOs

  const asteroidRef = useRef();
  const trailMeshRef = useRef();
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

  // Pre-calculate full 3D orbit path points (array of THREE.Vector3) for static orbit loop rendering
  const orbitPoints = useMemo(() => {
    const coords = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const xp = orbitRadius * Math.cos(theta);
      const zp = orbitRadius * Math.sin(theta);

      const xi = xp;
      const yi = -zp * Math.sin(inclination);
      const zi = zp * Math.cos(inclination);

      const xFinal = xi * Math.cos(nodeRotation) + zi * Math.sin(nodeRotation);
      const yFinal = yi;
      const zFinal = -xi * Math.sin(nodeRotation) + zi * Math.cos(nodeRotation);

      coords.push(new THREE.Vector3(xFinal, yFinal, zFinal));
    }
    return coords;
  }, [orbitRadius, inclination, nodeRotation]);

  const trailLength = 20;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Calculate current position along the orbit path based on time and custom speed
    const theta = startPhase + time * speed;

    const xp = orbitRadius * Math.cos(theta);
    const zp = orbitRadius * Math.sin(theta);

    const xi = xp;
    const yi = -zp * Math.sin(inclination);
    const zi = zp * Math.cos(inclination);

    const x = xi * Math.cos(nodeRotation) + zi * Math.sin(nodeRotation);
    const y = yi;
    const z = -xi * Math.sin(nodeRotation) + zi * Math.cos(nodeRotation);

    if (asteroidRef.current) {
      asteroidRef.current.position.set(x, y, z);
      asteroidRef.current.lookAt(0, 0, 0);
    }

    // Update trailing instanced particle meshes
    if (trailMeshRef.current) {
      const dummy = new THREE.Object3D();

      for (let i = 0; i < trailLength; i++) {
        // Sample points backwards along the orbit trajectory based on time lag
        const trailTheta = theta - (i * 0.015);

        const xtp = orbitRadius * Math.cos(trailTheta);
        const ztp = orbitRadius * Math.sin(trailTheta);

        const xti = xtp;
        const yti = -ztp * Math.sin(inclination);
        const zti = ztp * Math.cos(inclination);

        const tx = xti * Math.cos(nodeRotation) + zti * Math.sin(nodeRotation);
        const ty = yti;
        const tz = -xti * Math.sin(nodeRotation) + zti * Math.cos(nodeRotation);

        dummy.position.set(tx, ty, tz);

        // Taper the trail particles (fade out in size)
        const taper = 1.0 - i / trailLength;
        const scaleVal = sizeScale * (isDark ? 1.8 : 4) * taper;
        dummy.scale.set(scaleVal, scaleVal, scaleVal);

        dummy.updateMatrix();
        trailMeshRef.current.setMatrixAt(i, dummy.matrix);
      }

      trailMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Toggle label visibility based on whether the asteroid is facing the camera
    if (labelRef.current && asteroidRef.current) {
      const toCam = state.camera.position.clone().normalize();
      const toObj = new THREE.Vector3(x, y, z).normalize();
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

    // Radial gradient: white-hot center fading to asteroid color, then transparent
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, color); // Asteroid Blue color
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [color]);

  // Instanced trail geometries
  const trailGeometry = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);
  const trailMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: isDark ? 0.30 : 0.65, // More opaque in light mode for contrast
    blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending, // Normal blending in light mode to prevent fading into white background
    depthWrite: false
  }), [color, isDark]);

  return (
    <group>
      {/* Full static circular orbit path ring */}
      {orbitPoints.length > 0 && (
        <Line
          points={orbitPoints}
          color={color}
          lineWidth={0.5}
          transparent={true}
          opacity={0.08}
          depthWrite={false}
        />
      )}

      {/* Thick Glowing Dotted Trail */}
      <instancedMesh
        ref={trailMeshRef}
        args={[trailGeometry, trailMaterial, trailLength]}
      />

      {/* Glowing Sphere Asteroid */}
      <group ref={asteroidRef} name={id}>
        {/* Core solid sphere with raycast click handler for focus */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            setFocusedId(id);
          }}
        >
          <sphereGeometry args={[sizeScale, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>

        {/* Soft, smooth glowing halo sprite */}
        <sprite scale={[sizeScale * 5.0, sizeScale * 5.0, 1]}>
          <spriteMaterial
            map={glowTexture}
            blending={THREE.AdditiveBlending}
            transparent={true}
            depthWrite={false}
          />
        </sprite>

        {/* Simple Grey/Black Focus Label - Visible when facing the camera */}
        <Html distanceFactor={4} position={[0, sizeScale + 0.05, 0]} center>
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
              transition: 'opacity 0.2s ease'
            }}
          >
            {name}
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function NEOs({ globeRadius, focusedId, setFocusedId }) {
  const { neos, loading } = useNEOs(globeRadius);

  if (loading || neos.length === 0) return null;

  return (
    <group>
      {neos.map((neo) => (
        <SingleNEO
          key={neo.id}
          neo={neo}
          globeRadius={globeRadius}
          focusedId={focusedId}
          setFocusedId={setFocusedId}
        />
      ))}
    </group>
  );
}
