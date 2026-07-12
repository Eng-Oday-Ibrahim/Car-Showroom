'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input }                       from '../ui/input';
import { Button }                      from '../ui/button';
import { carsApi }                     from '../../lib/api/cars.api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Condition = 'all' | 'new' | 'used';

export function CarFilters() {
  const router     = useRouter();
  const params     = useSearchParams();
  const [makes, setMakes] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    make: params.get('make') ?? 'all',
    model: params.get('model') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    year: params.get('minYear') ?? params.get('maxYear') ?? '',
    condition: params.get('maxKm') === '0' ? 'new' : params.get('minKm') === '1' ? 'used' : 'all',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await carsApi.list({ perPage: 100 });
        if (!mounted) return;
        const uniq = Array.from(new Set(res.data.map(c => c.make).filter(Boolean))).sort();
        setMakes(uniq);
      } catch {
        // fail silently
      }
    })();
    return () => { mounted = false; };
  }, []);

  const updateField = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateCondition = useCallback((value: Condition) => {
    setFilters(prev => ({ ...prev, condition: value }));
  }, []);

  const applyFilters = useCallback(() => {
    const p = new URLSearchParams();
    if (filters.make && filters.make !== 'all') p.set('make', filters.make);
    if (filters.model) p.set('model', filters.model);
    if (filters.minPrice) p.set('minPrice', filters.minPrice);
    if (filters.maxPrice) p.set('maxPrice', filters.maxPrice);
    if (filters.year) {
      p.set('minYear', filters.year);
      p.set('maxYear', filters.year);
    }

    if (filters.condition === 'new') {
      // brand new car → 0 km driven
      p.set('maxKm', '0');
    } else if (filters.condition === 'used') {
      // used → at least 1 km on the clock
      p.set('minKm', '1');
    }
    // condition === 'all' → no km constraint at all

    p.set('page', '1');
    p.set('perPage', params.get('perPage') ?? '12');

    router.push(`?${p.toString()}`);
  }, [filters, params, router]);

  const reset = () => {
    setFilters({
      make: 'all',
      model: '',
      minPrice: '',
      maxPrice: '',
      year: '',
      condition: 'all',
    });
    router.push('?');
  };

  return (
    <div className="flex flex-wrap gap-3 w-full p-4 items-center bg-white">

      {/* Make / Brand */}
      <Select
        value={filters.make}
        onValueChange={v => updateField('make', v)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Makes</SelectItem>
          {makes.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Model */}
      <Input
        placeholder="Model"
        value={filters.model}
        className="w-full"
        onChange={e => updateField('model', e.target.value)}
      />

      <div className="flex grid-cols-2 gap-3 w-full">
        {/* Min price */}
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          className="w-auto"
          onChange={e => updateField('minPrice', e.target.value)}
        />

        {/* Max price */}
        <Input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          className="w-auto"
          onChange={e => updateField('maxPrice', e.target.value)}
        />
      </div>

      {/* Year — plain input instead of dropdown */}
      <Input
        type="number"
        placeholder="Year (e.g. 2022)"
        value={filters.year}
        className="w-full"
        min={1980}
        max={new Date().getFullYear() + 1}
        onChange={e => updateField('year', e.target.value)}
      />

      {/* Condition */}
      <Select
        value={filters.condition}
        onValueChange={v => updateCondition(v as Condition)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="used">Used</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="default" size="lg" className="w-full" onClick={applyFilters}>
        Search
      </Button>
      <Button variant="outline" size="sm" className="w-full" onClick={reset}>
        Reset Filters
      </Button>
    </div>
  );
}
