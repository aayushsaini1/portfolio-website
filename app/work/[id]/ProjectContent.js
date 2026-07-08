"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import WorkHeader from '../../../components/WorkHeader';

export default function ProjectContent({ project, htmlContent }) {
  const [activeId, setActiveId] = useState('');

  // Extract headings and inject IDs safely into htmlContent before rendering
  const { processedHtml, headings } = useMemo(() => {
    if (!htmlContent) return { processedHtml: '', headings: [] };

    const parsedHeadings = [];
    const updatedHtml = htmlContent.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, content) => {
      // Strip any nested HTML tags to get pure text content for the heading
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      
      // Create a URL-safe lowercase id
      const id = textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove non-alphanumeric, spaces, and hyphens
        .trim()
        .replace(/\s+/g, '-');

      parsedHeadings.push({
        id,
        text: textContent
      });

      return `<h2 id="${id}">${content}</h2>`;
    });

    return { processedHtml: updatedHtml, headings: parsedHeadings };
  }, [htmlContent]);

  // Setup scroll listener to track active section with absolute reliability
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let currentActiveId = '';
      const threshold = 120; // offset for the sticky header
      
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentActiveId = heading.id;
          }
        }
      }

      // Default to the first heading if none have passed the threshold yet
      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on initial render
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Sticky Header with Barcode Logo & Dark/Light mode toggle */}
      <WorkHeader />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1.6rem 6rem 1.6rem',
        width: '100%'
      }}>
        {/* Constrained layout container aligning breadcrumbs and content together */}
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          {/* Breadcrumb container */}
          <div style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--muted-color)',
            marginBottom: '3rem'
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'underline' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
              /home
            </Link>
            <span>/project-details.html</span>
          </div>

          <div className="project-layout">
            {/* Sticky Table of Contents sidebar */}
            {headings.length > 0 && (
              <aside className="project-toc-sidebar">
                <div className="project-toc-title">INDEX</div>
                <nav className="project-toc-list">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => handleScrollTo(e, heading.id)}
                      className={`project-toc-item ${activeId === heading.id ? 'active' : ''}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}

            {/* Main article body */}
            <article className="project-main-column">
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
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
