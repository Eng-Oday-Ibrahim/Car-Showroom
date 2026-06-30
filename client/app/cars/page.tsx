import type { Metadata }  from 'next';
import { Suspense }       from 'react';
import { carsApi }        from '../../lib/api/cars.api';
import { CarCard }        from '../../components/cars/car-card';
import { CarFilters }     from '../../components/cars/car-filters';
import { Pagination }     from '../../components/shared/pagination';
import { CarsGridSkeleton } from '../../components/shared/skeletons';

export const metadata: Metadata = {
  title:       'تصفح السيارات',
  description: 'تصفح مئات السيارات المتاحة لدينا وابحث بالماركة والموديل والسعر',
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'الأحدث أولاً'   },
  { value: 'price_asc',  label: 'السعر: الأقل'   },
  { value: 'price_desc', label: 'السعر: الأعلى'  },
  { value: 'year_desc',  label: 'السنة: الأحدث'  },
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
    page,
    perPage,
  };

  const result = await carsApi.list(filters);

  const buildHref = (p: number) =>
    `/cars?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`;

  const hasFilters = ['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear']
    .some(k => sp[k]);

  const activeFiltersCount = ['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear']
    .filter(k => sp[k]).length;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">السيارات</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {result.total > 0
              ? `${result.total.toLocaleString('ar')} سيارة متاحة`
              : 'لا توجد نتائج'}
            {hasFilters && (
              <span className="mr-2 text-blue-500">
                · {activeFiltersCount} {activeFiltersCount === 1 ? 'فلتر' : 'فلاتر'} مفعّلة
              </span>
            )}
          </p>
        </div>

        {/* Per page selector */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>عرض</span>
          {[12, 24, 48].map(n => (
            <a
              key={n}
              href={`/cars?${new URLSearchParams({ ...sp, perPage: String(n), page: '1' }).toString()}`}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                perPage === n
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {n}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar filters ── */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24 space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">الفلاتر</h2>
              {hasFilters && (
                <a
                  href="/cars"
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  مسح الكل ✕
                </a>
              )}
            </div>

            <Suspense fallback={<div className="h-48 animate-pulse bg-gray-50 rounded-xl" />}>
              <CarFilters />
            </Suspense>

          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 space-y-6">

          {/* Sort bar */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">
              الصفحة {page} من {result.totalPages}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">ترتيب:</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map(opt => (
                  <a
                    key={opt.value}
                    href={`/cars?${new URLSearchParams({ ...sp, sort: opt.value, page: '1' }).toString()}`}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      (sp['sort'] ?? 'newest') === opt.value
                        ? 'bg-gray-900 text-white'
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
            <div className="bg-white border border-gray-200 rounded-2xl py-24 text-center space-y-4">
              <p className="text-5xl">🔍</p>
              <p className="text-xl font-semibold text-gray-700">لا توجد سيارات تطابق بحثك</p>
              <p className="text-gray-400 text-sm">جرّب تغيير أو مسح معايير الفلترة</p>
              <a
                href="/cars"
                className="inline-block mt-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm hover:bg-gray-700 transition-colors"
              >
                عرض كل السيارات
              </a>
            </div>
          ) : (
            <>
              <Suspense fallback={<CarsGridSkeleton count={perPage} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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