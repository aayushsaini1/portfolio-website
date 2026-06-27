import React from 'react';
import InteractiveDotMatrix from './InteractiveDotMatrix';

export default function Hero({ data }) {
  if (!data) return null;

  const formattedTitle = data.title.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < data.title.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  const formatRole = (roleText) => {
    if (!roleText) return '';
    const parts = roleText.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.toLowerCase() === '@josys') {
        return (
          <a
            key={i}
            href="https://josys.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-role-link"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <section id="home" className="section hero-section">
      <div className="hero-text">
        <span className="section-label">[00]</span>
        <h1>{formattedTitle}</h1>
        <div className="hero-subtitle" style={{ fontSize: 'var(--font-size-md)' }}>{data.subtitle}</div>
        <div className="hero-role" style={{ fontSize: 'var(--font-size-md)' }}>{formatRole(data.role)}</div>

        <div className="hero-contact" style={{ marginTop: '40px' }}>
          <div className="hero-contact-item">
            <i>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </i>
            <a href={`mailto:${data.email}`} target="_blank" rel="noopener noreferrer">{data.email}</a>
          </div>
          <div className="hero-contact-item">
            <i>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </i>
            {data.location}
          </div>
          <div className="hero-contact-item">
            <i>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </i>
            <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">{data.website}</a>
          </div>
          <div className="hero-contact-item">
            <i>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </i>
            <a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer">{data.linkedin}</a>
          </div>
        </div>
      </div>

      <div className="hero-image-container">
        {/* Crosshairs */}
        <div className="crosshair ch-tl"></div>
        <div className="crosshair ch-tr"></div>
        <div className="crosshair ch-bl"></div>
        <div className="crosshair ch-br"></div>

        <div className='hero-image' style={{ position: 'absolute', top: '-3rem', right: '0', fontSize: 'var(--font-size-sm)', color: 'var(--accent-color)' }}>
          /dot-matrix.svg
        </div>

        <InteractiveDotMatrix />
      </div>
    </section>
  );
}
