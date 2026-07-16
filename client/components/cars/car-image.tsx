'use client';

import { useState, useRef, useEffect } from 'react';
import { Car } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CarImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean; // skip lazy-loading for above-fold cards
}

export function CarImage({ src, alt, className, fallbackClassName, priority = false }: CarImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const imageSrc = src?.trim();

  // ✅ On mount, check if the browser already has the image (cached).
  // If img.complete is true, the onLoad event won't fire again, so we
  // set loaded=true immediately — eliminating the gray skeleton flash on
  // page reload when images are in the browser cache.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [imageSrc]);

  if (!imageSrc || failed) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-gray-100 text-gray-300', fallbackClassName)}>
        <Car className="h-5 w-5" />
      </div>
    );
  }

  return (
    // wrapper div so skeleton + img stack correctly inside the parent's relative container
    <div className="absolute inset-0">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(false); }}
      />
    </div>
  );
}