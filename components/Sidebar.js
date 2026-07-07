"use client";

import React, { useState, useEffect } from 'react';

export default function Sidebar() {
  const [timeStr, setTimeStr] = useState('10:42:17');
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    if (!mounted) return;
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeStr(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const sections = ['home', 'about', 'work', 'experience', 'experiments', 'contact'];

    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [mounted]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
    setIsOpen(false); // Close drawer on mobile after nav click
  };

  return (
    <>
      {/* ── Mobile sticky header — hidden on desktop via CSS ── */}
      <header className="mobile-header" role="banner">
        {/* Left: hamburger / close toggle */}
        <button
          id="mobile-menu-btn"
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect y="2" width="20" height="2" rx="1" />
              <rect y="9" width="20" height="2" rx="1" />
              <rect y="16" width="20" height="2" rx="1" />
            </svg>
          )}
        </button>

        {/* Center: barcode logo */}
        <div className="mobile-header-logo">
          <svg width="80" height="24" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="4" height="30" />
            <rect x="6" y="0" width="2" height="30" />
            <rect x="10" y="0" width="8" height="30" />
            <rect x="20" y="0" width="2" height="30" />
            <rect x="24" y="0" width="6" height="30" />
            <rect x="34" y="0" width="4" height="30" />
            <rect x="40" y="0" width="2" height="30" />
            <rect x="44" y="0" width="8" height="30" />
            <rect x="54" y="0" width="4" height="30" />
            <rect x="60" y="0" width="2" height="30" />
            <rect x="66" y="0" width="6" height="30" />
            <rect x="74" y="0" width="4" height="30" />
            <rect x="80" y="0" width="8" height="30" />
            <rect x="90" y="0" width="2" height="30" />
            <rect x="94" y="0" width="6" height="30" />
          </svg>
        </div>

        {/* Right: dark / light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="mobile-theme-btn"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>

      {/* Overlay backdrop — only visible when drawer is open on mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        {/* Spacer on mobile so content clears the fixed hamburger button */}
        <div className="sidebar-mobile-spacer" />
        <div className="sidebar-logo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <svg width="80" height="30" viewBox="0 0 100 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="4" height="30" />
              <rect x="6" y="0" width="2" height="30" />
              <rect x="10" y="0" width="8" height="30" />
              <rect x="20" y="0" width="2" height="30" />
              <rect x="24" y="0" width="6" height="30" />
              <rect x="34" y="0" width="4" height="30" />
              <rect x="40" y="0" width="2" height="30" />
              <rect x="44" y="0" width="8" height="30" />
              <rect x="54" y="0" width="4" height="30" />
              <rect x="60" y="0" width="2" height="30" />
              <rect x="66" y="0" width="6" height="30" />
              <rect x="74" y="0" width="4" height="30" />
              <rect x="80" y="0" width="8" height="30" />
              <rect x="90" y="0" width="2" height="30" />
              <rect x="94" y="0" width="6" height="30" />
            </svg>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <button
                onClick={toggleDarkMode}
                className="theme-toggle-btn"
                aria-label="Toggle dark mode"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'currentColor',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', marginTop: '0.5rem' }}>alpher03</div>
        </div>

        <ul className="sidebar-nav">
          <li className={activeSection === 'home' ? 'active' : ''}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
              <span><span className="nav-num">00</span> home</span>
              {activeSection !== 'home' && <span className="dot"></span>}
            </a>
          </li>
          <li className={activeSection === 'about' ? 'active' : ''}>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
              <span><span className="nav-num">01</span> about</span>
              {activeSection !== 'about' && <span className="dot"></span>}
            </a>
          </li>
          <li className={activeSection === 'work' ? 'active' : ''}>
            <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo('work'); }}>
              <span><span className="nav-num">02</span> work</span>
              {activeSection !== 'work' && <span className="dot"></span>}
            </a>
          </li>
          <li className={activeSection === 'experience' ? 'active' : ''}>
            <a href="#experience" onClick={(e) => { e.preventDefault(); scrollTo('experience'); }}>
              <span><span className="nav-num">03</span> experience</span>
              {activeSection !== 'experience' && <span className="dot"></span>}
            </a>
          </li>
          <li className={activeSection === 'experiments' ? 'active' : ''}>
            <a href="#experiments" onClick={(e) => { e.preventDefault(); scrollTo('experiments'); }}>
              <span><span className="nav-num">04</span> experiments</span>
              {activeSection !== 'experiments' && <span className="dot"></span>}
            </a>
          </li>
          <li className={activeSection === 'contact' ? 'active' : ''}>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
              <span><span className="nav-num">05</span> contact</span>
              {activeSection !== 'contact' && <span className="dot"></span>}
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div>status:</div>
            <div className="status-row">
              <span className="status-indicator"></span>
              <span className="status-text">available for work</span>
            </div>
          </div>

          <div className="sidebar-timezone">
            timezone:<br />
            IST (UTC +5:30)<br />
            {mounted ? timeStr : '10:42:17'}
          </div>

          <div className="sidebar-copyright">
            {"\u00A9"} 2026 aayush saini
          </div>
        </div>
      </aside>
    </>
  );
}
