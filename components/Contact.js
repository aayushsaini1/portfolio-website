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

      <button className="btn-primary">
        {data.buttonText}
        <div className="btn-crosshair"></div>
      </button>
    </section>
  );
}
