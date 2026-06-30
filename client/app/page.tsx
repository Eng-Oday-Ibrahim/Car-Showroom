import { Suspense }   from 'react';
import type { Metadata } from 'next';
import { carsApi }    from '../lib/api/cars.api';
import { CarCard }    from '../components/cars/car-card';
import { CarFilters } from '../components/cars/car-filters';
import { Pagination } from '../components/shared/pagination';
import { CarsGridSkeleton } from '../components/shared/skeletons';
import type { CarFilters as ICarFilters } from '../types/car.types';

export const metadata: Metadata = { title: 'available cars' };

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const sp   = await searchParams;
  const page = Number(sp['page'] ?? 1);

  const filters: ICarFilters = {
    make:     sp['make']     || undefined,
    model:    sp['model']    || undefined,
    minPrice: sp['minPrice'] ? Number(sp['minPrice']) : undefined,
    maxPrice: sp['maxPrice'] ? Number(sp['maxPrice']) : undefined,
    minYear:  sp['minYear']  ? Number(sp['minYear'])  : undefined,
    maxYear:  sp['maxYear']  ? Number(sp['maxYear'])  : undefined,
    page,
    perPage:  20,
  };

  const result = await carsApi.list(filters);
  const hasFilters = Object.values(sp).some(Boolean);

  const buildHref = (p: number) =>
    `?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`;

  return (
    <div className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-l from-gray-900 to-gray-700 rounded-3xl px-8 py-12 text-white">
        <h1 className="text-4xl font-bold leading-tight">Find Your Perfect Car</h1>
        <p className="text-gray-300 mt-2 text-lg">
          {result.total.toLocaleString('ar')} available cars at the best prices
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-4">Filter Results</p>
        <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg" />}>
          <CarFilters />
        </Suspense>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          {hasFilters
            ? `${result.total} Results`
            : `show ${result.data.length} from ${result.total} Cars`}
        </p>
        {hasFilters && (
          <a href="/" className="text-sm text-blue-600 hover:underline">remove filters</a>
        )}
      </div>

      {/* Grid */}
      {result.data.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-semibold text-gray-700">No cars match your search</p>
          <p className="text-gray-400 mt-2 text-sm">Try changing or clearing the filter criteria</p>
          <a href="/" className="inline-block mt-6 px-5 py-2 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 transition-colors">
          show all cars
          </a>
        </div>
      ) : (
        <>
          <Suspense fallback={<CarsGridSkeleton count={8} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.data.map(car => <CarCard key={car.id} car={car} />)}
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
  );
}
