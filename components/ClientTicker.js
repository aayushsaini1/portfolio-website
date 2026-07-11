"use client";

import React from 'react';
import Image from 'next/image';

const clientLogos = [
  { name: 'Josys', src: '/clients/josys.webp' },
  { name: 'Loconav', src: '/clients/loconav.webp' },
  { name: 'Stamurai', src: '/clients/stamurai.webp' },
  { name: 'Buidl', src: '/clients/buidl.webp' },
  { name: 'Mountain', src: '/clients/mountain.webp' },
  { name: 'Techtonic', src: '/clients/techtonic.webp' },
  { name: 'HiveWise', src: '/clients/hivewise.webp' },
  { name: 'Krew', src: '/clients/krew.webp' },
  { name: 'Washi', src: '/clients/washi.webp' },
  { name: 'ECell', src: '/clients/ecell.webp' },
];

export default function ClientTicker() {
  // Duplicate logos array twice to ensure seamless infinite looping scroll
  const scrollItems = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <div className="client-ticker-container" style={{
      width: '100%',
      maxWidth: '60rem', // 600px max width limit
      overflow: 'hidden',
      position: 'relative',
      padding: '2rem 0',
      background: 'transparent'
    }}>
      {/* Edge gradient overlays for smooth fade-in/fade-out */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '8rem',
        height: '100%',
        background: 'linear-gradient(to right, var(--bg-color), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '8rem',
        height: '100%',
        background: 'linear-gradient(to left, var(--bg-color), transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Animated track */}
      <div className="client-ticker-track" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        width: 'max-content'
      }}>
        {scrollItems.map((logo, index) => (
          <div
            key={index}
            className="client-ticker-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Image
              src={logo.src}
              alt={`${logo.name} logo`}
              width={200}
              height={48}
              style={{
                height: '2.4rem', // height of 24px consistent with the design aesthetics
                width: 'auto',
                transition: 'opacity 0.2s ease, filter 0.2s ease'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
