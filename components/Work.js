import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Work({ data }) {
  if (!data) return null;
  return (
    <section id="work" className="section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label">[02]</span>
          <h2 style={{ fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', width: '120px' }}>WORK</h2>
        </div>

        <div className="projects-grid" style={{ flex: 1 }}>
          {data.map((project, index) => (
            <Link key={index} href={`/work/${project.slug}`} className="project-card">
              <div className="project-image">
                {project.image ? (
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image-inner"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="project-placeholder-inner">[ WORK {index + 1} ]</div>
                )}
              </div>
              <div className="project-meta-top">
                <span className="project-number">{project.number}</span>
                <span className="project-info">{project.company} , {project.year}</span>
              </div>
              <div className="project-meta-bottom">
                <span className="project-title">{project.title}</span>
                <span className="project-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="accent-block" style={{ width: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
          <div style={{ color: 'white', textAlign: 'center' }}>[ OB-4<br />PLACEHOLDER ]</div>
        </div>
      </div>
    </section>
  );
}
