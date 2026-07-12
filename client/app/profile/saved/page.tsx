'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, ArrowLeft, X } from 'lucide-react';
import { carsApi } from '../../../lib/api/cars.api';
// NOTE: `unsaveCar` is assumed to be the counterpart to `getSavedCarIds`.
// Adjust this import/name if your auth lib exports it differently.
import { getSavedCarIds, getStoredAuth } from '../../../lib/auth/auth';
import type { Car } from '../../../types/car.types';
import { formatPrice, formatKm } from '../../../lib/utils';
import { useI18n } from '@/lib/i18n';
import { CarImage } from '../../../components/cars/car-image';
import {SaveCarButton} from '../../../components/cars/save-car-button';

export default function SavedPage() {
  const { t } = useI18n();
  const [auth, setAuth] = useState(getStoredAuth());
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getStoredAuth();
    setAuth(current);

    if (!current.token) {
      setCars([]);
      setLoading(false);
      return;
    }

    const loadSavedCars = async () => {
      const savedIds = await getSavedCarIds(current.user?.id);
      if (savedIds.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }

      try {
        const items = await Promise.all(savedIds.map((id) => carsApi.getById(id).then((response) => response.data)));
        setCars(items);
      } catch {
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    void loadSavedCars();
  }, []);

  

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">

      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        {t('profileSaved.backToProfile')}
      </Link>

      <div className="flex items-center justify-between pb-8 border-b border-gray-100">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">{t('profileSaved.title')}</h1>
          <p className="text-sm text-gray-400">{t('profileSaved.description')}</p>
        </div>
        <span className="text-sm text-gray-400">{cars.length} saved</span>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">{t('profileSaved.loading')}</p>
      ) : cars.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <Heart className="w-8 h-8 text-gray-300 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">{t('profileSaved.emptyTitle')}</h2>
          <p className="text-gray-400 text-sm">{t('profileSaved.emptyDescription')}</p>
          <Link
            href="/cars"
            className="inline-block mt-2 px-6 py-2.5 bg-gray-900 text-white rounded text-sm hover:bg-gray-700 transition-colors"
          >
            {t('profileSaved.browseCars')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
          {cars.map((car) => (
            <div key={car.id} className="group space-y-3 bg-white rounded border border-gray-200">
              <div className="relative aspect-[4/3] bg-gray-50 rounded overflow-hidden">
                <Link href={`/cars/${car.id}`}>
                  <CarImage
                    src={car.images[0] ?? '/placeholder-car.jpg'}
                    alt={`${car.make} ${car.model}`}
                    className="object-cover"
                  />
                </Link>

              <SaveCarButton carId={car.id}/>
              </div>

              <Link href={`/cars/${car.id}`} className="block space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{car.make} {car.model}</h3>
                  <span className="text-sm text-gray-400">{car.year}</span>
                </div>
                <p className="text-sm text-gray-400">{car.fuelType} · {car.transmission}</p>
                <p className="text-base font-semibold text-gray-900">{formatPrice(car.price)}</p>
                <p className="text-sm text-gray-400">{formatKm(car.kmDriven)}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}