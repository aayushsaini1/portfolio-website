import React from 'react';
import Image from 'next/image';

export default function Experiments({ data }) {
  if (!data) return null;
  return (
    <section id="experiments" className="section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label">[04]</span>
          <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', width: '120px' }}>EXPERIMENTS</h2>
        </div>

        <div className="experiments-grid">
          {data.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="experiment-card"
            >
              {item.image && (
                <div className="experiment-image-container">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="experiment-image"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading='eager'
                  />
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
                    <svg
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
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                  <p className="experiment-desc">
                    {item.description}
                  </p>
                </div>

                <div className="experiment-tags">
                  {item.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
