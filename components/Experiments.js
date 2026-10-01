'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const platformIcons = {
  watch: {
    label: 'Watch',
    shape: <><rect x="6" y="7" width="12" height="10" rx="3" /><path d="M9 7V2h6v5M9 17v5h6v-5M18 10h2" /></>,
  },
  web: {
    label: 'Web',
    shape: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
  },
  phone: {
    label: 'Phone',
    shape: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  },
  laptop: {
    label: 'Mac / Laptop',
    shape: <><rect x="4" y="3" width="16" height="12" rx="1" /><path d="m4 15-2 4h20l-2-4M10 19h4" /></>,
  },
};

function PlatformIcon({ platform }) {
  const icon = platformIcons[platform];
  if (!icon) return null;

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={icon.label}>
      <title>{icon.label}</title>
      {icon.shape}
    </svg>
  );
}

export default function Experiments({ data }) {
  const trackRef = useRef(null);
  const [scrollState, setScrollState] = useState({ previous: false, next: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const updateControls = () => {
      setScrollState({
        previous: track.scrollLeft > 1,
        next: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
      });
    };
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    for (const card of track.children) observer.observe(card);
    track.addEventListener('scroll', updateControls, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', updateControls);
    };
  }, [data]);

  const scrollCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * ((card?.getBoundingClientRect().width || track.clientWidth) + gap),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  if (!data) return null;
  return (
    <section id="experiments" className="section">
      <div className="section-inner">
        <div className="section-header experiments-header">
          <div>
            <span className="section-label">[04]</span>
            <h2 id="experiments-heading" style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase' }}>EXPERIMENTS</h2>
          </div>
          <div className="experiments-controls">
            <button type="button" aria-label="Previous experiments" aria-controls="experiments-track" disabled={!scrollState.previous} onClick={() => scrollCards(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </button>
            <button type="button" aria-label="Next experiments" aria-controls="experiments-track" disabled={!scrollState.next} onClick={() => scrollCards(1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={trackRef} id="experiments-track" className="experiments-grid" role="region" aria-labelledby="experiments-heading" tabIndex={0}>
          {data.map((item) => {
            const Card = item.link ? 'a' : 'article';
            return (
              <Card
                key={item.title}
                href={item.link || undefined}
                target={item.link ? '_blank' : undefined}
                rel={item.link ? 'noopener noreferrer' : undefined}
                className="experiment-card"
              >
                {item.image ? (
                  <div className="experiment-image-container">
                    <Image
                      src={item.image}
                      alt={item.title}
                      className="experiment-image"
                      fill
                      sizes="(max-width: 768px) 88vw, (max-width: 1200px) 45vw, 28vw"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="experiment-image-container experiment-image-placeholder">
                    <span>Preview coming soon</span>
                  </div>
                )}
                <div className="experiment-card-body">
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1.2rem'
                    }}>
                      <h3 className="experiment-title">
                        {item.title}
                      </h3>
                      {item.link && <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="experiment-arrow"
                        style={{ marginTop: '0.2rem' }}
                        aria-hidden="true"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>}
                    </div>
                    <p className="experiment-desc">
                      {item.description}
                    </p>
                  </div>

                  <div className="experiment-platforms" role="group" aria-label="Platforms">
                    {item.platforms.map((platform) => (
                      <PlatformIcon key={platform} platform={platform} />
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
