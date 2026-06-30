'use client';

import Image       from 'next/image';
import Link        from 'next/link';
import type { Car } from '../../types/car.types';
import { formatPrice, formatKm } from '../../lib/utils';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const thumbnail = car.images[0] ?? '/placeholder-car.jpg';

  return (
    <Link href={`/cars/${car.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">

        {/* Image */}
        <div className="relative h-52 w-full bg-gray-100">
          <Image
            src={thumbnail}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {car.kmDriven === 0 && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              جديد
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {car.make} {car.model}
            </h3>
            <span className="text-sm text-gray-500 shrink-0">{car.year}</span>
          </div>

          {/* Specs row */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {car.fuelType   && <span>{car.fuelType}</span>}
            {car.fuelType   && car.transmission && <span>·</span>}
            {car.transmission && <span>{car.transmission}</span>}
            {car.transmission && <span>·</span>}
            <span>{formatKm(car.kmDriven)}</span>
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-primary">
            {formatPrice(car.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}