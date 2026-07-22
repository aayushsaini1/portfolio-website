import React from 'react';
import InteractiveDotMatrix from './InteractiveDotMatrix';
import ClientTicker from './ClientTicker';

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
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`} target="_blank" rel="noopener noreferrer">{data.location}</a>
          </div>
          <div className="hero-contact-item">
            <i>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </i>
            <a href={data.twitterUrl || "https://x.com/aayushsaini_"} target="_blank" rel="noopener noreferrer">{data.twitter || "@aayushsaini_"}</a>
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
        <ClientTicker />
      </div>

      <div className="hero-image-container">
        {/* Crosshairs */}
        <div className="crosshair ch-tl"></div>
        <div className="crosshair ch-tr"></div>
        <div className="crosshair ch-bl"></div>
        <div className="crosshair ch-br"></div>

        <InteractiveDotMatrix />
        <div className='hero-image' style={{ position: 'absolute', top: '-3rem', right: '0', fontSize: 'var(--font-size-sm)', color: 'var(--accent-color)' }}>
          /human-portrait.svg
        </div>
      </div>
    </section>
  );
}
