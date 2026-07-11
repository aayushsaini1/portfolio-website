import React from 'react';
import Link from 'next/link';
import WorkHeader from '../../../components/WorkHeader';
import { getWorkData, getWorkDetailHtml } from '../../../lib/content';

export async function generateStaticParams() {
  const workData = getWorkData();
  return workData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const workData = getWorkData();
  const project = workData.find((p) => p.slug === slug);
  
  return {
    title: project ? `${project.title} | Portfolio` : 'Project Details | Portfolio',
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const workData = getWorkData();
  const project = workData.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <WorkHeader />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>Project not found.</div>
        </div>
      </div>
    );
  }

  const detailData = getWorkDetailHtml(slug);
  const htmlContent = detailData ? detailData.htmlContent : '';

  return (
    <ProjectContent project={project} htmlContent={htmlContent} />
  );
}

// Separate client component to handle the interactivity safely (onMouseEnter/onMouseLeave)
// keeping the page itself as a server component to fetch and read local files via lib/content.js
import ProjectContent from './ProjectContent';
