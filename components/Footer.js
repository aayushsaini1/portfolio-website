import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bottom-bar">
      <div><span style={{ color: 'var(--accent-color)', fontSize: '12px', marginRight: '10px' }}>■</span> BUILT WITH:</div>
      <Link href="https://antigravity.google" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>ANTIGRAVITY,</Link>
      <div>COFFEE</div>
      <div>AND</div>
      <div>TOKENS<span style={{ color: 'var(--text-color)', fontSize: '12px', marginLeft: '16px' }}>■</span></div>
    </footer>
  );
}
