import React from 'react';
import WorkHeader from '../../components/WorkHeader';
import Globe from '../../components/about/globe/Globe';

export const metadata = {
  title: 'About | Orbital Globe Tracker',
  description: 'Interactive 3D globe tracker displaying the live International Space Station (ISS) position and Near Earth Objects (NEOs) using NASA public data.',
};

export default function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-color)',
      color: 'var(--text-color)',
      overflow: 'hidden'
    }}>
      {/* Header showing barcode logo and theme toggle */}
      <WorkHeader />
      
      {/* Interactive Globe Container */}
      <div style={{
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 80px)', // adjust for sticky header height
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Subtle engineering telemetry HUD in top left */}
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          left: '2.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-xs)',
          textTransform: 'uppercase',
          color: 'var(--muted-color)',
          letterSpacing: '0.12em',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Telemetry:</span>
            <span style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }} />
            <span>Online</span>
          </div>
          <div>ISS position: Live tracking</div>
          <div>NEOs: NASA API</div>
        </div>

        {/* Orbit Control Tip in bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--font-size-xs)',
          textTransform: 'uppercase',
          color: 'var(--accent-color)',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          [ Left-click + drag to rotate | Scroll to zoom ]
        </div>

        {/* Dynamic 3D Globe Wrapper positioned absolutely to occupy full height/width without flex collapse */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          outline: 'none',
          zIndex: 1
        }}>
          <Globe />
        </div>
      </div>
    </div>
  );
}
