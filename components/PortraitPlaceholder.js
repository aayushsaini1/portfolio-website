import Image from 'next/image';

export default function PortraitPlaceholder() {
  return (
    <Image
      src="/portrait-preview.webp"
      alt="Dot matrix portrait of Aayush Saini"
      fill
      unoptimized
      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 300px, 400px"
      loading="eager"
      fetchPriority="high"
      style={{ objectFit: 'cover' }}
    />
  );
}
