'use client';

import { useEffect } from 'react';
import WorkHeader from '../../components/WorkHeader';
import HoloResumeWrapper from '../../components/holocloth/HoloResumeWrapper';

export default function ResumePage() {
  useEffect(() => {
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden fixed inset-0" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <WorkHeader />
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <HoloResumeWrapper />
      </main>
    </div>
  );
}
