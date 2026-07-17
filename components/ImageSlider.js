"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ImageSlider({ 
  before, 
  after, 
  beforeLabel = "Before", 
  afterLabel = "After",
  height = "auto",
  aspectRatio = "16/10"
}) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="image-comparison-slider"
      style={{
        position: 'relative',
        width: '100%',
        height: height,
        aspectRatio: height === 'auto' ? aspectRatio : 'initial',
        overflow: 'hidden',
        borderRadius: '1.6rem',
        border: '0.1rem solid var(--border-color)',
        userSelect: 'none',
        margin: '3rem 0'
      }}
    >
      {/* After Image (Background) */}
      <Image 
        src={after} 
        alt={afterLabel} 
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        style={{
          objectFit: 'cover',
          objectPosition: 'left top',
          pointerEvents: 'none'
        }}
      />
      <span 
        className="slider-label after" 
        style={{
          position: 'absolute',
          right: '2rem',
          top: '2rem',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '0.6rem 1.2rem',
          borderRadius: '0.8rem',
          fontSize: '1.2rem',
          fontFamily: 'var(--font-mono), monospace',
          zIndex: 2
        }}
      >
        {afterLabel}
      </span>

      {/* Before Image (Resizable Overlay) */}
      <div 
        className="before-wrapper" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${position}%`,
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          borderRight: '2px solid #fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: containerWidth ? `${containerWidth}px` : '100vw'
        }}>
          <Image 
            src={before} 
            alt={beforeLabel} 
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            style={{
              objectFit: 'cover',
              objectPosition: 'left top',
              maxWidth: 'none'
            }}
          />
        </div>
        <span 
          className="slider-label before" 
          style={{
            position: 'absolute',
            left: '2rem',
            top: '2rem',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '0.8rem',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-mono), monospace',
            zIndex: 2
          }}
        >
          {beforeLabel}
        </span>
      </div>

      {/* Slider Handle Circle */}
      <div 
        className="slider-handle" 
        style={{
          position: 'absolute',
          top: '50%',
          left: `${position}%`,
          width: '4.8rem',
          height: '4.8rem',
          marginTop: '-2.4rem',
          marginLeft: '-2.4rem',
          background: '#fff',
          border: '0.2rem solid var(--accent-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          pointerEvents: 'none',
          boxShadow: '0 0.4rem 1.2rem rgba(0,0,0,0.3)',
          transform: isDragging ? 'scale(1.15)' : 'scale(1.0)',
          transition: 'transform 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-color)' }}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Transparent Input Range for touch/mouse drag control */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={position} 
        onChange={(e) => setPosition(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'ew-resize',
          zIndex: 4,
          margin: 0,
          padding: 0
        }}
        aria-label="Before and after comparison slider"
      />
    </div>
  );
}
