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
import { Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const PER_PAGE = 20;

export default function DashboardCarsPage() {
  const { t } = useI18n();
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
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboardCars.title')}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? '...' : `${total.toLocaleString('en')} ${t('dashboardCars.carsLabel')}`}
          </p>
        </div>
        <Link href="/dashboard/cars/new">
          <Button>{t('dashboardCars.createCar')} <Plus /></Button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex flex-wrap gap-3 items-end">

          <div className="space-y-1">
            <p className="text-xs text-gray-400">{t('dashboardCars.filters.make')}</p>
            <Input
              placeholder={t('dashboardCars.filters.makePlaceholder')}
              className="w-36 h-9 text-sm"
              value={(filters.make as string) ?? ''}
              onChange={e => setFilter('make', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">{t('dashboardCars.filters.model')}</p>
            <Input
              placeholder={t('dashboardCars.filters.modelPlaceholder')}
              className="w-36 h-9 text-sm"
              value={(filters.model as string) ?? ''}
              onChange={e => setFilter('model', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">{t('dashboardCars.filters.status')}</p>
            <Select
              value={(filters.status as string) ?? 'all'}
              onValueChange={v => setFilter('status', v)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder={t('dashboardCars.filters.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboardCars.filters.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('dashboardCars.filters.statusActive')}</SelectItem>
                <SelectItem value="paused">{t('dashboardCars.filters.statusPaused')}</SelectItem>
                <SelectItem value="sold">{t('dashboardCars.filters.statusSold')}</SelectItem>
                <SelectItem value="deleted">{t('dashboardCars.filters.statusDeleted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400">{t('dashboardCars.filters.source')}</p>
            <Select
              value={(filters.source as string) ?? 'all'}
              onValueChange={v => setFilter('source', v)}
            >
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder={t('dashboardCars.filters.allSources')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboardCars.filters.allSources')}</SelectItem>
                <SelectItem value="local">{t('dashboardCars.filters.sourceLocal')}</SelectItem>
                <SelectItem value="dubicars">{t('dashboardCars.filters.sourceDubicars')}</SelectItem>
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
              {t('dashboardCars.filters.clearFilters')} ✕
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