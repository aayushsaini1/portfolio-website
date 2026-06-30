"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Hide the sidebar when we are inside a project detail page (e.g. starting with '/work/')
  const isWorkDetailPage = pathname && pathname.startsWith('/work/');

  return (
    <div className="app-container" style={isWorkDetailPage ? { display: 'block', maxWidth: '100%', border: 'none' } : {}}>
      {!isWorkDetailPage && <Sidebar />}
      <main className="main-content" style={isWorkDetailPage ? { width: '100%' } : {}}>
        {children}
        {!isWorkDetailPage && <Footer />}
      </main>
    </div>
  );
}
