'use client';

import Link from 'next/link';
import { CarForm } from '../../../../components/cars/car-form';
import { useI18n } from '@/lib/i18n';

export default function NewCarPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link href="/dashboard" className="hover:text-gray-700">{t('dashboardCars.breadcrumb.dashboard')}</Link>
            <span>/</span>
            <Link href="/dashboard/cars" className="hover:text-gray-700">{t('dashboardCars.breadcrumb.cars')}</Link>
            <span>/</span>
            <span className="text-gray-700">{t('dashboardCars.newCarTitle')}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboardCars.newCarTitle')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('dashboardCars.newCarDescription')}</p>
        </div>
        <Link href="/dashboard/cars">
          <button className="text-sm text-gray-400 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl transition-colors">
            {t('dashboardCars.back')}
          </button>
        </Link>
      </div>

      <CarForm />
    </div>
  );
}
