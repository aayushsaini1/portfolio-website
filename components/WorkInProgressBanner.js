"use client";

import Link from 'next/link';
import React from 'react';

export default function WorkInProgressBanner() {
  return (
    <div>
      <div className="wip-banner">
        <div className="wip-stripe wip-stripe-top"></div>
        <div className="wip-content">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#000000" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '1.5rem' }}>
            <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
          </svg>
          WORK IN PROGRESS
        </div>
        <div className="wip-stripe wip-stripe-bottom"></div>
      </div>
      <div style={{ marginTop: '1.6rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono), monospace', fontSize: '2rem', color: 'var(--muted-color)' }}>
        <span>Curious?</span>
        <span>Connect to talk [<Link href="https://www.linkedin.com/in/aayushsaini1/" style={{ textDecoration: 'underline' }}>Linkedin</Link>] [<Link href="mailto:aayushsaini.77@gmail.com/" style={{ textDecoration: 'underline' }}>Email</Link>]</span>
      </div>
    </div>
  );
}
