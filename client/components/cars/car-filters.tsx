'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { carsApi } from '../../lib/api/cars.api';
import { useI18n } from '../../lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Condition = 'all' | 'new' | 'used';

interface CarOption {
  make: string;
  model: string;
}

export function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();

  const [allCars, setAllCars] = useState<CarOption[]>([]);
  const [filters, setFilters] = useState({
    make: params.get('make') ?? 'all',
    model: params.get('model') ?? 'all',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    year: params.get('minYear') ?? params.get('maxYear') ?? '',
    condition: (params.get('maxKm') === '0'
      ? 'new'
      : params.get('minKm') === '1'
      ? 'used'
      : 'all') as Condition,
  });

  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    setFilters({
      make: params.get('make') ?? 'all',
      model: params.get('model') ?? 'all',
      minPrice: params.get('minPrice') ?? '',
      maxPrice: params.get('maxPrice') ?? '',
      year: params.get('minYear') ?? params.get('maxYear') ?? '',
      condition: (params.get('maxKm') === '0'
        ? 'new'
        : params.get('minKm') === '1'
        ? 'used'
        : 'all') as Condition,
    });
  }, [params]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let res;
        try {
          res = await carsApi.list({ perPage: 500 });
        } catch {
          res = await carsApi.list({ perPage: 100 });
        }
        if (!mounted || !res?.data) return;
        setAllCars(
          res.data
            .filter(c => Boolean(c.make && c.model))
            .map(c => ({ make: c.make, model: c.model }))
        );
      } catch { /* fail silently */ }
    })();
    return () => { mounted = false; };
  }, []);

  const availableMakes = Array.from(
    new Set(
      (filters.model && filters.model !== 'all'
        ? allCars.filter(c => c.model === filters.model)
        : allCars
      ).map(c => c.make)
    )
  ).sort();

  const availableModels = Array.from(
    new Set(
      (filters.make && filters.make !== 'all'
        ? allCars.filter(c => c.make === filters.make)
        : allCars
      ).map(c => c.model)
    )
  ).sort();

  const sanitizePrice = (val: string): string => {
    const n = Number(val);
    if (val === '' || isNaN(n) || n < 0) return '';
    return String(Math.floor(n));
  };

  const pushUrl = useCallback((updated: typeof filters) => {
    const p = new URLSearchParams(params.toString());
    if (updated.make && updated.make !== 'all') p.set('make', updated.make);
    else p.delete('make');

    if (updated.model && updated.model !== 'all') p.set('model', updated.model);
    else p.delete('model');

    const minPrice = sanitizePrice(updated.minPrice);
    const maxPrice = sanitizePrice(updated.maxPrice);
    if (minPrice) p.set('minPrice', minPrice); else p.delete('minPrice');
    if (maxPrice) p.set('maxPrice', maxPrice); else p.delete('maxPrice');

    if (updated.year) {
      const y = Number(updated.year);
      if (!isNaN(y) && y >= 1980 && y <= new Date().getFullYear() + 1) {
        p.set('minYear', updated.year);
        p.set('maxYear', updated.year);
      } else {
        p.delete('minYear');
        p.delete('maxYear');
      }
    } else {
      p.delete('minYear');
      p.delete('maxYear');
    }

    if (updated.condition === 'new') {
      p.set('maxKm', '0');
      p.delete('minKm');
    } else if (updated.condition === 'used') {
      p.set('minKm', '1');
      p.delete('maxKm');
    } else {
      p.delete('minKm');
      p.delete('maxKm');
    }

    p.set('page', '1');
    if (!p.get('perPage')) p.set('perPage', '24');

    router.replace(`?${p.toString()}`, { scroll: false });
  }, [params, router]);

  const handleSelect = useCallback((key: keyof typeof filters, value: string) => {
    const updated = { ...filtersRef.current, [key]: value };

    if (key === 'make' && value !== 'all') {
      const modelsForMake = allCars.filter(c => c.make === value).map(c => c.model);
      if (updated.model !== 'all' && !modelsForMake.includes(updated.model)) {
        updated.model = 'all';
      }
    }
    if (key === 'model' && value !== 'all') {
      const makesForModel = allCars.filter(c => c.model === value).map(c => c.make);
      if (updated.make !== 'all' && !makesForModel.includes(updated.make)) {
        updated.make = 'all';
      }
    }

    setFilters(updated);
    pushUrl(updated);
  }, [allCars, pushUrl]);

  const handleInput = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushUrl({ ...filtersRef.current, [key]: value });
    }, 600);
  }, [pushUrl]);

  const reset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const p = new URLSearchParams();
    const currentSort = params.get('sort');
    if (currentSort && currentSort !== 'newest') p.set('sort', currentSort);
    const perPage = params.get('perPage');
    if (perPage) p.set('perPage', perPage);
    router.replace(p.toString() ? `?${p.toString()}` : '?', { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4 bg-white border border-gray-100">
      <Select value={filters.make} onValueChange={v => handleSelect('make', v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`${t('carFilters.all')} ${t('carFilters.make')}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{`${t('carFilters.all')} ${t('carFilters.make')}`}</SelectItem>
          {availableMakes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.model} onValueChange={v => handleSelect('model', v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`${t('carFilters.all')} ${t('carFilters.model')}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{`${t('carFilters.all')} ${t('carFilters.model')}`}</SelectItem>
          {availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="flex gap-3">
        <Input
          type="number"
          placeholder={t('carFilters.minPrice')}
          value={filters.minPrice}
          min={0}
          onChange={e => handleInput('minPrice', e.target.value)}
        />
        <Input
          type="number"
          placeholder={t('carFilters.maxPrice')}
          value={filters.maxPrice}
          min={0}
          onChange={e => handleInput('maxPrice', e.target.value)}
        />
      </div>

      <Input
        type="number"
        placeholder={t('carFilters.yearRange')}
        value={filters.year}
        min={1980}
        max={new Date().getFullYear() + 1}
        onChange={e => handleInput('year', e.target.value)}
      />

      <Select value={filters.condition} onValueChange={v => handleSelect('condition', v as Condition)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('carFilters.condition')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('carFilters.all')}</SelectItem>
          <SelectItem value="new">{t('carFilters.new')}</SelectItem>
          <SelectItem value="used">{t('carFilters.used')}</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" className="w-full font-medium cursor-pointer" onClick={reset}>
        {t('carFilters.reset')}
      </Button>
    </div>
  );
}