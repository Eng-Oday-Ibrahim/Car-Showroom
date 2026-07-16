'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { ArrowUpDown, SlidersHorizontal, SearchX } from 'lucide-react';
import type { CarFilters } from '@/types/car.types';

interface CarSortHeaderProps {
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
  activeFiltersCount: number;
}

export function CarSortTopBar({ total, perPage, activeFiltersCount }: { total: number; perPage: number; activeFiltersCount: number }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePerPage = (n: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set('perPage', String(n));
    p.set('page', '1');
    router.push(`/cars?${p.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-gray-100">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">{t('navbar.cars')}</h1>
        <p className="text-sm text-gray-400">
          {total > 0
            ? `${total.toLocaleString()} ${t('navbar.cars')}`
            : t('carsTable.noCarsFound')}
          {activeFiltersCount > 0 && (
            <span className="mx-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
              {activeFiltersCount}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
        <span>{t('carsTable.actions')}</span>
        <div className="flex gap-1">
          {[12, 24, 48].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handlePerPage(n)}
              className={`px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                perPage === n
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CarSortBar({ page, totalPages }: { page: number; totalPages: number }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSort = (searchParams.get('sort') as CarFilters['sort']) || 'newest';

  const sortOptions = [
    { value: 'newest', label: t('carSort.newest') },
    { value: 'price_asc', label: t('carSort.priceAsc') },
    { value: 'price_desc', label: t('carSort.priceDesc') },
    { value: 'year_desc', label: t('carSort.yearDesc') },
  ];

  const handleSort = (sortValue: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (sortValue === 'newest') {
      p.delete('sort');
    } else {
      p.set('sort', sortValue);
    }
    p.set('page', '1');
    router.push(`/cars?${p.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
      <p className="text-sm text-gray-400">
        {totalPages > 0 ? `${page} / ${totalPages}` : ''}
      </p>
      <div className="flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1.5 text-gray-400 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5" />
          {t('carSort.title')}:
        </span>
        <div className="flex flex-wrap gap-1">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSort(opt.value)}
              className={`px-2.5 py-1 text-xs md:text-sm transition-all cursor-pointer ${
                currentSort === opt.value
                  ? 'bg-[#050505] text-white font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CarsEmptyState() {
  const { t } = useI18n();
  return (
    <div className="py-24 text-center space-y-4">
      <SearchX className="w-8 h-8 text-gray-300 mx-auto" />
      <p className="text-xl font-semibold text-gray-900">{t('carsTable.noCarsFound')}</p>
      <p className="text-gray-400 text-sm">{t('carFilters.reset')}</p>
      <Link
        href="/cars"
        className="inline-block mt-2 px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
      >
        {t('carFilters.all')}
      </Link>
    </div>
  );
}
