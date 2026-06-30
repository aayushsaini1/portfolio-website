"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorkHeader() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="work-header" role="banner" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 4rem',
      borderBottom: '0.1rem solid var(--border-color)',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-color)',
      zIndex: 100
    }}>
      {/* Left: barcode logo */}
      <Link href="/" aria-label="Go to Home">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="80" height="24" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="0"  y="0" width="4"  height="30"/>
            <rect x="6"  y="0" width="2"  height="30"/>
            <rect x="10" y="0" width="8"  height="30"/>
            <rect x="20" y="0" width="2"  height="30"/>
            <rect x="24" y="0" width="6"  height="30"/>
            <rect x="34" y="0" width="4"  height="30"/>
            <rect x="40" y="0" width="2"  height="30"/>
            <rect x="44" y="0" width="8"  height="30"/>
            <rect x="54" y="0" width="4"  height="30"/>
            <rect x="60" y="0" width="2"  height="30"/>
            <rect x="66" y="0" width="6"  height="30"/>
            <rect x="74" y="0" width="4"  height="30"/>
            <rect x="80" y="0" width="8"  height="30"/>
            <rect x="90" y="0" width="2"  height="30"/>
            <rect x="94" y="0" width="6"  height="30"/>
          </svg>
        </div>
      </Link>

      {/* Right: dark / light mode toggle */}
      <button
        onClick={toggleDarkMode}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-color)',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1"  x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1"  y1="12" x2="3"  y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
            <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
    </header>
  );
}
