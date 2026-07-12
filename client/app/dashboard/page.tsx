'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { carsApi } from '../../lib/api/cars.api';
import { Button } from '../../components/ui/button';
import { useI18n } from '@/lib/i18n';
import {
  Car as CarIcon,
  CheckCircle2,
  PauseCircle,
  BadgeCheck,
  Trash2,
  RefreshCw,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusCounts {
  total: number;
  active: number;
  paused: number;
  sold: number;
  deleted: number;
}

const EMPTY_COUNTS: StatusCounts = {
  total: 0,
  active: 0,
  paused: 0,
  sold: 0,
  deleted: 0,
};

export default function DashboardHomePage() {
  const { t } = useI18n();
  const [counts, setCounts] = useState<StatusCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const loadCounts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // fetch all status buckets in parallel — perPage:1 because we only need `total`
      const [all, active, paused, sold, deleted] = await Promise.all([
        carsApi.listAll({ page: 1, perPage: 1 }),
        carsApi.listAll({ page: 1, perPage: 1, status: 'active' }),
        carsApi.listAll({ page: 1, perPage: 1, status: 'paused' }),
        carsApi.listAll({ page: 1, perPage: 1, status: 'sold' }),
        carsApi.listAll({ page: 1, perPage: 1, status: 'deleted' }),
      ]);

      setCounts({
        total: all.total,
        active: active.total,
        paused: paused.total,
        sold: sold.total,
        deleted: deleted.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboardHome.errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCounts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadCounts]);

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    try {
      await carsApi.sync();
      await loadCounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboardHome.errorSync'));
    } finally {
      setSyncing(false);
    }
  };

  const statCards = [
    {
      key: 'total',
      label: t('dashboardHome.stats.totalCars'),
      value: counts.total,
      icon: CarIcon,
      accent: 'text-gray-900 bg-gray-100',
    },
    {
      key: 'active',
      label: t('dashboardHome.stats.activeCars'),
      value: counts.active,
      icon: CheckCircle2,
      accent: 'text-green-700 bg-green-50',
    },
    {
      key: 'paused',
      label: t('dashboardHome.stats.pausedCars'),
      value: counts.paused,
      icon: PauseCircle,
      accent: 'text-amber-700 bg-amber-50',
    },
    {
      key: 'sold',
      label: t('dashboardHome.stats.soldCars'),
      value: counts.sold,
      icon: BadgeCheck,
      accent: 'text-blue-700 bg-blue-50',
    },
    {
      key: 'deleted',
      label: t('dashboardHome.stats.deletedCars'),
      value: counts.deleted,
      icon: Trash2,
      accent: 'text-red-700 bg-red-50',
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboardHome.title')}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{t('dashboardHome.description')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? t('dashboardHome.syncing') : t('dashboardHome.syncCars')}
          </Button>
          <Link href="/dashboard/cars/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboardHome.createCar')}
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stat cards — plain display, no links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
              className="bg-white border border-gray-200 p-5"
            >
              <div className={`inline-flex p-2 ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="mt-4">
                {loading ? (
                  <div className="h-8 w-14 bg-gray-100 animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 tabular-nums">
                    {card.value.toLocaleString('en')}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/cars"
          className="flex items-center justify-between bg-white border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-semibold text-gray-900">{t('dashboardHome.manageCars')}</p>
            <p className="text-sm text-gray-400 mt-0.5">{t('dashboardHome.manageCarsDescription')}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>

        <Link
          href="/dashboard/users"
          className="flex items-center justify-between bg-white border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
        >
          <div>
            <p className="font-semibold text-gray-900">{t('dashboardHome.manageUsers')}</p>
            <p className="text-sm text-gray-400 mt-0.5">{t('dashboardHome.manageUsersDescription')}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </Link>
      </div>

    </div>
  );
}
