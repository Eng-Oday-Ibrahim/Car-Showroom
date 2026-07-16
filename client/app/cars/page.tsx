import type { Metadata }  from 'next';
import { Suspense }       from 'react';
import { carsApi }        from '../../lib/api/cars.api';
import { CarCard }        from '../../components/cars/car-card';
import { CarFilters }     from '../../components/cars/car-filters';
import { Pagination }     from '../../components/shared/pagination';
import { CarsGridSkeleton } from '../../components/shared/skeletons';
import { CarSortTopBar, CarSortBar, CarsEmptyState } from '../../components/cars/car-sort-header';
import { SlidersHorizontal } from 'lucide-react';
import { Translate } from '../../lib/i18n';
import type { CarFilters as CarFiltersType } from '../../types/car.types';

export const metadata: Metadata = {
  title:       'Cars',
  description: 'Browse hundreds of cars available to us and search by brand, model, and price',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function CarsPage({ searchParams }: PageProps) {
  const sp      = await searchParams;
  const page    = Number(sp['page']    ?? 1);
  const perPage = Number(sp['perPage'] ?? 24);

  const filters: CarFiltersType = {
    make:     sp['make']     || undefined,
    model:    sp['model']    || undefined,
    minPrice: sp['minPrice'] != null && sp['minPrice'] !== '' ? Number(sp['minPrice']) : undefined,
    maxPrice: sp['maxPrice'] != null && sp['maxPrice'] !== '' ? Number(sp['maxPrice']) : undefined,
    minYear:  sp['minYear']  != null && sp['minYear'] !== ''  ? Number(sp['minYear'])  : undefined,
    maxYear:  sp['maxYear']  != null && sp['maxYear'] !== ''  ? Number(sp['maxYear'])  : undefined,
    minKm:    sp['minKm']    != null && sp['minKm'] !== ''    ? Number(sp['minKm'])    : undefined,
    maxKm:    sp['maxKm']    != null && sp['maxKm'] !== ''    ? Number(sp['maxKm'])    : undefined,
    sort:     (sp['sort'] as CarFiltersType['sort']) || undefined,
    page,
    perPage,
  };

  const result = await carsApi.list(filters);

  const buildHref = (p: number) =>
    `/cars?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`;

  const activeFiltersCount = ['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minKm', 'maxKm']
    .filter(k => sp[k] != null && sp[k] !== '').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">

      {/* Page header */}
      <CarSortTopBar total={result.total} perPage={perPage} activeFiltersCount={activeFiltersCount} />

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ── Sidebar filters ── */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wide">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <Translate id="carFilters.title" />
              </h2>
            </div>

            <Suspense fallback={<div className="h-48 animate-pulse bg-gray-50" />}>
              <CarFilters />
            </Suspense>

          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 space-y-8">

          {/* Sort bar */}
          <CarSortBar page={result.page} totalPages={result.totalPages} />

          {/* Grid */}
          {result.data.length === 0 ? (
            <CarsEmptyState />
          ) : (
            <>
              <Suspense fallback={<CarsGridSkeleton count={perPage} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {result.data.map((car, index) => (
                    <CarCard key={car.id} car={car} priority={index < 6} />
                  ))}
                </div>
              </Suspense>

              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                buildHref={buildHref}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
}
