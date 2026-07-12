'use client';

import { useState } from 'react';
import { Car } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CarImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function CarImage({ src, alt, className, fallbackClassName }: CarImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src?.trim();

  if (!imageSrc || failed) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-gray-100 text-gray-300', fallbackClassName)}>
        <Car className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
