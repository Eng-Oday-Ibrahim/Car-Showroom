'use client';

import { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { CarImage as CarPhoto } from './car-image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';

interface CarGalleryProps {
  images: string[];
  title: string;
}

export function CarGallery({ images, title }: CarGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActive(api.selectedScrollSnap());
    api.on('select', () => setActive(api.selectedScrollSnap()));
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="h-72 bg-gray-50 flex items-center justify-center text-gray-300">
        <Car className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main carousel */}
      <Carousel setApi={setApi} className="group">
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i}>
              <div className="relative bg-gray-50 overflow-hidden aspect-[16/9]">
                <CarPhoto
                  src={img}
                  alt={`${title} photo ${i + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="start-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="end-3 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Counter */}
            <div className="absolute top-3 end-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-medium">
              {active + 1} / {images.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>

      {/* Thumbnail strip — synced with active slide */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`relative shrink-0 w-20 h-14 overflow-hidden transition-opacity ${
                i === active ? 'ring-1 ring-gray-900' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <CarPhoto src={img} alt={`${title} photo ${i + 1}`} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}