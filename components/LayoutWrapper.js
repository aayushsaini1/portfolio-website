"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide the sidebar when we are inside a project detail page (e.g. starting with '/work/') or the about page
  const isWorkDetailPage = pathname && (pathname.startsWith('/work/') || pathname === '/about');

  return (
    <div className="app-container" style={isWorkDetailPage ? { display: 'block', width: '100%', maxWidth: '100vw', border: 'none' } : {}}>
      {!isWorkDetailPage && <Sidebar />}
      <main className="main-content" style={isWorkDetailPage ? { width: '100%', maxWidth: '100%', boxSizing: 'border-box', paddingTop: '0px' } : {}}>
        {children}
        {!isWorkDetailPage && <Footer />}
      </main>
    </div>
  );
}
