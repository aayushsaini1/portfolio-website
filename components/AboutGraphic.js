"use client";

import React, { useRef, useEffect, useState } from 'react';

export default function AboutGraphic() {
  const canvasRef = useRef(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = 300;
      canvas.height = 130;
    };
    resizeCanvas();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const centerX = width / 2;

      // Fetch current theme styles
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#ff4500';
      const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-color').trim() || '#888888';
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000000';

      // 1. Draw Axis Divider Line
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(centerX, height - 10);
      ctx.stroke();

      // Bottom Axis Base removed

      // 3. Draw Left Side Noisy Waves (3 overlapping streams)
      ctx.lineWidth = 1;
      const numNoiseWaves = 3;
      for (let w = 0; w < numNoiseWaves; w++) {
        ctx.strokeStyle = mutedColor;
        ctx.beginPath();
        
        const freqOffset = w * 0.18;
        const ampOffset = w * 7;
        const speedFactor = 1.1 + w * 0.18;

        for (let x = 10; x <= centerX; x++) {
          // Amplitude dampens to 0 at center divider line
          const progress = x / centerX;
          const amplitude = (30 - ampOffset) * (1 - progress);
          
          // Generate complex wave pattern simulating noise
          const wave1 = Math.sin(x * 0.10 + time * speedFactor + freqOffset);
          const wave2 = Math.cos(x * 0.28 - time * speedFactor * 1.4 + w);
          const wave3 = Math.sin(x * 0.52 + time * 0.7);
          
          const noiseVal = (wave1 * 0.5 + wave2 * 0.35 + wave3 * 0.15) * amplitude;
          const y = centerY + noiseVal;

          if (x === 10) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 4. Draw Right Side Clean Sine Wave (flows from the center)
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = centerX; x <= width - 10; x++) {
        const progress = (x - centerX) / (width - 10 - centerX);
        // Amplitude fades in from center divider
        const amplitude = 22 * Math.min(progress * 5, 1);
        
        const y = centerY + Math.sin((x - centerX) * 0.18 - time * 1.8) * amplitude;

        if (x === centerX) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', width: '30rem' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '30rem', 
          height: '13rem',
          display: 'block'
        }} 
      />
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        converting noise to signal
      </div>
    </div>
  );
}
