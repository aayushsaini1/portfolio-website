import React from 'react';

export default function Tools({ data }) {
  if (!data) return null;
  return (
    <section id="tools" className="section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label">[04]</span>
          <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', width: '120px' }}>TOOLS</h2>
        </div>

        <div className="stack-section" style={{ flex: 1 }}>
          {data.map((col, index) => (
            <div key={index} className="stack-column">
              <div className="stack-title">{col.title}</div>
              <ul className="stack-list">
                {col.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="stack-graphic" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: 'var(--muted-color)' }}>[ TX-6 PLACEHOLDER ]</div>
        </div>
      </div>
    </section>
  );
}
