import type { Metadata }  from 'next';
import Link               from 'next/link';
import { Suspense }       from 'react';
import { carsApi }        from '../../lib/api/cars.api';
import { CarCard }        from '../../components/cars/car-card';
import { CarFilters }     from '../../components/cars/car-filters';
import { Pagination }     from '../../components/shared/pagination';
import { CarsGridSkeleton } from '../../components/shared/skeletons';
import { SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';

export const metadata: Metadata = {
  title:       'Cars',
  description: 'Browse hundreds of cars available to us and search by brand, model, and price',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'newest'   },
  { value: 'price_asc',  label: 'price: lowest'   },
  { value: 'price_desc', label: 'price: highest'  },
  { value: 'year_desc',  label: 'year: latest'  },
];

export default async function CarsPage({ searchParams }: PageProps) {
  const sp      = await searchParams;
  const page    = Number(sp['page']    ?? 1);
  const perPage = Number(sp['perPage'] ?? 24);

  const filters = {
    make:     sp['make']     || undefined,
    model:    sp['model']    || undefined,
    minPrice: sp['minPrice'] ? Number(sp['minPrice']) : undefined,
    maxPrice: sp['maxPrice'] ? Number(sp['maxPrice']) : undefined,
    minYear:  sp['minYear']  ? Number(sp['minYear'])  : undefined,
    maxYear:  sp['maxYear']  ? Number(sp['maxYear'])  : undefined,
    minKm:    sp['minKm']    ? Number(sp['minKm'])    : undefined,
    maxKm:    sp['maxKm']    ? Number(sp['maxKm'])    : undefined,
    page,
    perPage,
  };

  const result = await carsApi.list(filters);

  const buildHref = (p: number) =>
    `/cars?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`;

  const hasFilters = ['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minKm', 'maxKm']
    .some(k => sp[k]);

  const activeFiltersCount = ['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minKm', 'maxKm']
    .filter(k => sp[k]).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-gray-100">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Cars</h1>
          <p className="text-sm text-gray-400">
            {result.total > 0
              ? `${result.total.toLocaleString('ar')} available cars`
              : 'No results found'}
            {hasFilters && (
              <span className="mr-2 text-gray-900">
                {' '}· {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
              </span>
            )}
          </p>
        </div>

        {/* Per page selector */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
          <span>Show</span>
          <div className="flex gap-1">
            {[12, 24, 48].map(n => (
              <a
                key={n}
                href={`/cars?${new URLSearchParams({ ...sp, perPage: String(n), page: '1' }).toString()}`}
                className={`px-2.5 py-1 text-xs transition-colors ${
                  perPage === n
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {n}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* ── Sidebar filters ── */}
        <aside className="lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wide">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                Filters
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
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-400">
              Page {page} of {result.totalPages}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-gray-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort
              </span>
              <div className="flex gap-0.5 md:gap-1">
                {SORT_OPTIONS.map(opt => (
                  <a
                    key={opt.value}
                    href={`/cars?${new URLSearchParams({ ...sp, sort: opt.value, page: '1' }).toString()}`}
                    className={`px-2 py-1 text-xs md:text-sm transition-colors ${
                      (sp['sort'] ?? 'newest') === opt.value
                        ? 'bg-[#050505] text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {result.data.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <SearchX className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xl font-semibold text-gray-900">No cars found matching your search</p>
              <p className="text-gray-400 text-sm">Try changing or clearing the filter criteria</p>
              <Link
                href="/cars"
                className="inline-block mt-2 px-6 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
              >
                Show all cars
              </Link>
            </div>
          ) : (
            <>
              <Suspense fallback={<CarsGridSkeleton count={perPage} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {result.data.map(car => (
                    <CarCard key={car.id} car={car} />
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
