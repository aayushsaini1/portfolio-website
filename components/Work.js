import React from 'react';

export default function Work({ data }) {
  if (!data) return null;
  return (
    <section id="work" className="section">
      <span className="section-label">[02]</span>
      <div style={{ display: 'flex', gap: '40px' }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', width: '120px' }}>WORK</h2>

        <div className="projects-grid" style={{ flex: 1 }}>
          {data.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: 'var(--muted-color)', fontSize: 'var(--font-size-xs)' }}>[ WORK {index + 1} ]</div>
              </div>
              <div className="project-meta">
                <span className="project-number">{project.number}</span>
                <span className="project-title">{project.title}</span>
                <span className="project-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="accent-block" style={{ width: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: 'white', textAlign: 'center' }}>[ OB-4<br />PLACEHOLDER ]</div>
        </div>
      </div>
    </section>
  );
}
