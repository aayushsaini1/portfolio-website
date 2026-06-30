"use client";

import React from 'react';

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
    </section>
  );
}
