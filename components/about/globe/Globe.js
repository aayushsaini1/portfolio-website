"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the WebGL Scene component with SSR disabled
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: 'var(--muted-color)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }}>
      {/* Loading ring */}
      <div className="globe-loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '1px solid var(--border-color)',
        borderRadius: '50%',
        borderTopColor: 'var(--accent-color)',
        animation: 'spin 1.5s linear infinite'
      }} />
      <div>[ Initializing Orbital Canvas... ]</div>
    </div>
  )
});

export default function Globe() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Scene />
    </div>
  );
}
