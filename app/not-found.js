import React from 'react';
import WorkHeader from '../components/WorkHeader';
import Globe from '../components/about/globe/Globe';

export const metadata = {
  title: '404 - Lost in Orbit',
  description: 'Page not found. Interactive 3D globe tracker displaying the live International Space Station (ISS) position and Near Earth Objects (NEOs).',
};

export default function NotFound() {
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
      {/* <WorkHeader /> */}

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
              backgroundColor: '#ef4444', // Red pulse for error status
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ color: '#ef4444' }}>ERROR 404</span>
          </div>
          <div>Location: Lost in Orbit</div>
          <div>ISS position: Live tracking</div>
          <div>NEOs: NASA API</div>
        </div>

        {/* Big bold Lost in Space 404 Header Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none', // Allow clicking/dragging the globe behind it
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(5rem, 12vw, 10rem)',
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
            color: 'var(--accent-color)',
            letterSpacing: '-0.03em'
          }}>404</h1>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            margin: 0,
            color: 'var(--text-color)'
          }}>Lost in Orbit / Page Not Found</p>
          <a href="/" style={{
            pointerEvents: 'auto', // Re-enable pointer events for the link so it is clickable
            marginTop: '1.5rem',
            padding: '1rem 2rem',
            border: '1px solid var(--border-color)',
            fontSize: 'var(--font-size-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--text-color)',
            textDecoration: 'none',
            backgroundColor: 'var(--bg-color)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
            className="not-found-home-btn"
          >
            [ Return to Home ]
          </a>
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
