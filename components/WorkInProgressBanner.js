"use client";

import Link from 'next/link';
import React from 'react';

export default function WorkInProgressBanner() {
  return (
    <div>
      <div className="wip-banner">
        <div className="wip-stripe wip-stripe-top"></div>
        <div className="wip-content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="wip-icon" style={{ margin: 0 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>REDACTED</span>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'none', marginTop: '0.4rem', opacity: 0.8 }}>
              ask nicely, I might show you
            </span>
          </div>
        </div>
        <div className="wip-stripe wip-stripe-bottom"></div>
      </div>
      <div
        className="wip-connect-card"
        style={{
          position: 'relative',
          marginTop: '3.2rem',
          padding: '3.2rem 2.4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.2rem',
          fontFamily: 'var(--font-mono), monospace',
          backgroundColor: 'var(--container-bg-color)'
        }}
      >
        {/* Accent Corner Anchors */}
        <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', color: 'var(--accent-color)', fontSize: 'var(--font-size-md)', lineHeight: 1, pointerEvents: 'none' }}>⌜</div>
        <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', color: 'var(--accent-color)', fontSize: 'var(--font-size-md)', lineHeight: 1, pointerEvents: 'none' }}>⌝</div>
        <div style={{ position: 'absolute', bottom: '-1rem', left: '-1rem', color: 'var(--accent-color)', fontSize: 'var(--font-size-md)', lineHeight: 1, pointerEvents: 'none' }}>⌞</div>
        <div style={{ position: 'absolute', bottom: '-1rem', right: '-1rem', color: 'var(--accent-color)', fontSize: 'var(--font-size-md)', lineHeight: 1, pointerEvents: 'none' }}>⌟</div>
        <div>
          <h3 style={{ fontSize: '2rem', letterSpacing: '0.2em', fontWeight: 600, color: 'var(--text-color)', margin: 0, textTransform: 'uppercase' }}>
            Curious about this?
          </h3>
          <p style={{ fontSize: '1.2rem', color: 'var(--muted-color)', margin: 0 }}>
            Let's hop on a call and talk more
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '1.6rem', color: 'var(--muted-color)', marginTop: '0.4rem' }}>
          <Link className="wip-link" href="https://www.linkedin.com/in/aayushsaini1/" target="_blank" rel="noopener noreferrer">[Linkedin]</Link> <Link className="wip-link" href="mailto:aayushsaini.77@gmail.com">[Email]</Link>
        </div>
      </div>
    </div>
  );
}
