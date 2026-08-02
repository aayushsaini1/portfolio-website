"use client";

import React from 'react';
import Link from 'next/link';

export default function Contact({ data }) {
  if (!data) return null;
  return (
    <section id="contact" className="section contact-footer">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label" style={{ marginBottom: 0 }}>[05]</span>
          <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', width: '120px' }}>{data.title}</h2>
        </div>

        <div className="contact-text">
          <div style={{ marginBottom: '0.3125rem' }}>{data.line1}</div>
          <div>{data.line2}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/resume" style={{ textDecoration: 'none' }}>
          <button
            className="btn-primary"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              transition: 'box-shadow 0.2s ease',
              cursor: 'pointer',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `inset 0 0 0 4px rgba(0, 0, 0, 0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Resume
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </Link>

        <a href="mailto:aayushsaini.77@gmail.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button
            className="btn-primary"
            style={{
              transition: 'box-shadow 0.2s ease',
              cursor: 'pointer',
              border: 'none',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              const isDark = document.documentElement.classList.contains('dark');
              const strokeColor = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = `inset 0 0 0 4px ${strokeColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {data.buttonText}
            <div className="btn-crosshair"></div>
          </button>
        </a>
      </div>
    </section>
  );
}
