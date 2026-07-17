"use client";

import React, { useRef, useEffect, useState } from 'react';
import { dotMatrixData } from './dotMatrixData';

export default function InteractiveDotMatrix() {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 1079;
    canvas.height = 1443;

    const numDots = dotMatrixData.length;
    
    // Arrays tracking state per dot
    const currentX = new Float32Array(numDots);
    const currentY = new Float32Array(numDots);
    const currentRadii = new Float32Array(numDots);
    
    for (let i = 0; i < numDots; i++) {
      currentX[i] = dotMatrixData[i][0]; // original cx
      currentY[i] = dotMatrixData[i][1]; // original cy
      currentRadii[i] = dotMatrixData[i][2]; // original radius
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const vel = velocityRef.current;
      const influenceRadius = 200; // range of influence

      // Calculate cursor speed
      const velocityMag = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

      // Decay mouse velocity on each frame so displacement returns to home
      vel.x *= 0.88;
      vel.y *= 0.88;

      for (let i = 0; i < numDots; i++) {
        const dot = dotMatrixData[i];
        const [cx, cy, originalR, rVal, gVal, bVal, aVal] = dot;

        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = cx;
        let targetY = cy;
        let targetR = originalR;

        if (dist < influenceRadius) {
          const proximity = 1 - (dist / influenceRadius); // 0 to 1
          
          // Option 1: Horizontal Scanline/Block Slipping (Digital Signal Error)
          // Generates high-frequency row-based offsets so adjacent lines slip in opposite directions
          const rowNoise = Math.sin(cy * 12) * Math.cos(cy * 3.8); 
          const slipOffset = vel.x * proximity * rowNoise * 3.5; // Dramatic horizontal offset multiplier
          
          targetX = cx + slipOffset;
          // Small vertical displacement to show trailing movement
          targetY = cy + vel.y * proximity * 0.4;

          // Option 3: Coordinate Jitter (electrical buzzing noise) based on movement speed
          const jitter = velocityMag * proximity * 0.45;
          if (jitter > 0.2) {
            targetX += (Math.random() - 0.5) * jitter;
            targetY += (Math.random() - 0.5) * jitter;
          }

          const factor = dist / influenceRadius;
          targetR = originalR * Math.max(0.3, factor);
        }

        // Apply easing for smooth position and scaling springs
        currentX[i] += (targetX - currentX[i]) * 0.12;
        currentY[i] += (targetY - currentY[i]) * 0.12;
        currentRadii[i] += (targetR - currentRadii[i]) * 0.12;

        // Draw dot in its original high-contrast B&W/orange colors
        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${aVal})`;
        ctx.beginPath();
        ctx.arc(currentX[i], currentY[i], currentRadii[i], 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      if (mouseRef.current.x !== -2000) {
        // Track displacement velocity vector
        velocityRef.current = {
          x: mouseX - mouseRef.current.x,
          y: mouseY - mouseRef.current.y
        };
      }

      mouseRef.current = { x: mouseX, y: mouseY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -2000, y: -2000 };
      velocityRef.current = { x: 0, y: 0 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <img
        src="/portrait.webp"
        alt="Dot matrix portrait placeholder"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
        cursor: 'crosshair'
      }}
    />
  );
}
