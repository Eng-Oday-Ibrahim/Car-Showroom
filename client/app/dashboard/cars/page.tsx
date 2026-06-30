'use client';

import { useEffect, useState, useCallback } from 'react';
import Link                                  from 'next/link';
import { carsApi }                           from '../../../lib/api/cars.api';
import { CarsTable }                         from '../../../components/cars/cars-table';
import { Pagination }                        from '../../../components/shared/pagination';
import { TableSkeleton }                     from '../../../components/shared/skeletons';
import { Button }                            from '../../../components/ui/button';
import { Input }                             from '../../../components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select';
import type { Car, CarFilters } from '../../../types/car.types';

const PER_PAGE = 20;

export default function DashboardCarsPage() {
  const [cars,       setCars]       = useState<Car[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState<CarFilters>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await carsApi.listAll({ ...filters, page, perPage: PER_PAGE });
      setCars(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const setFilter = (key: keyof CarFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? undefined : value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">السيارات</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? '...' : `${total.toLocaleString('ar')} سيارة`}
          </p>
        </div>
        <Link href="/dashboard/cars/new">
          <Button>➕ إضافة سيارة</Button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex flex-wrap gap-3 items-end">

          <div className="space-y-1">
            <p className="text-xs text-gray-400">الماركة</p>
            <Input
              placeholder="مثال: Toyota"
              className="w-36 h-9 text-sm"
              value={(filters.make as string) ?? ''}
              onChange={e => setFilter('make', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">الموديل</p>
            <Input
              placeholder="مثال: Camry"
              className="w-36 h-9 text-sm"
              value={(filters.model as string) ?? ''}
              onChange={e => setFilter('model', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">الحالة</p>
            <Select
              value={(filters.status as string) ?? 'all'}
              onValueChange={v => setFilter('status', v)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="كل الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="active">✅ نشط</SelectItem>
                <SelectItem value="paused">⏸️ موقوف</SelectItem>
                <SelectItem value="sold">🏷️ مباع</SelectItem>
                <SelectItem value="deleted">🗑️ محذوف</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">المصدر</p>
            <Select
              value={(filters.source as string) ?? 'all'}
              onValueChange={v => setFilter('source', v)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="كل المصادر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المصادر</SelectItem>
                <SelectItem value="local">🏠 محلي</SelectItem>
                <SelectItem value="dubicars">🔗 دبي كار</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-gray-400 hover:text-gray-700"
              onClick={resetFilters}
            >
              مسح الفلاتر ✕
            </Button>
          )}

        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={10} />
      ) : (
        <>
          <CarsTable cars={cars} onRefresh={load} />
          <Pagination
            page={page}
            totalPages={totalPages}
            buildHref={() => '#'}
            onPageChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </>
      )}

    </div>
  );
}