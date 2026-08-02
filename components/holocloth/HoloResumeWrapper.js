'use client';

import dynamic from 'next/dynamic';

const HoloResumeCanvas = dynamic(
  () => import('./HoloResumeCanvas'),
  { ssr: false }
);

export default function HoloResumeWrapper() {
  return <HoloResumeCanvas />;
}
