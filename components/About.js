import React from 'react';
import AboutGraphic from './AboutGraphic';

export default function About({ data }) {
  if (!data) return null;
  return (
    <section id="about" className="section about-section">
      <div style={{ display: 'flex', gap: '40px' }}>
        <div>
          <span className="section-label">[01]</span>
          <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase' }}>{data.title}</h2>
        </div>
        <div className="about-text" style={{ fontSize: 'var(--font-size-md)' }}>
          {data.content}
        </div>
      </div>

      <div className="about-graphic">
        <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', color: 'var(--accent-color)' }}>⌜</div>
        <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', color: 'var(--accent-color)' }}>⌝</div>
        <div style={{ position: 'absolute', bottom: '-1rem', left: '-1rem', color: 'var(--accent-color)' }}>⌞</div>
        <div style={{ position: 'absolute', bottom: '-1rem', right: '-1rem', color: 'var(--accent-color)' }}>⌟</div>
        <AboutGraphic />
      </div>
    </section>
  );
}
