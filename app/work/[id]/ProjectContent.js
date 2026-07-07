"use client";

import React from 'react';
import Link from 'next/link';
import WorkHeader from '../../../components/WorkHeader';

export default function ProjectContent({ project, htmlContent }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Sticky Header with Barcode Logo & Dark/Light mode toggle */}
      <WorkHeader />

      {/* Breadcrumb container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 1.6rem 1rem 1.6rem',
        width: '100%'
      }}>
        <div style={{ width: '100%', maxWidth: '720px', fontSize: 'var(--font-size-base)', color: 'var(--muted-color)' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'underline' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
            /home
          </Link>
          <span>/project-details.html</span>
        </div>
      </div>

      {/* Main Content Area: Width constrained to 720px max, centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1.6rem 6rem 1.6rem',
        width: '100%'
      }}>
        <article style={{ width: '100%', maxWidth: '720px' }}>
          <header style={{ marginBottom: '4rem' }}>
            <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '2.0rem', marginBottom: '1rem' }}>
              [{project.number}]
            </div>
            <h1 style={{
              fontSize: '3.6rem',
              textTransform: 'uppercase',
              lineHeight: 1.2,
              margin: 0
            }}>
              {project.title}
            </h1>
          </header>

          <section
            className="project-content"
            style={{ fontSize: 'var(--font-size-md)', lineHeight: '1.6', color: 'var(--desc-text-color)' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  );
}
