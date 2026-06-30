'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback }                 from 'react';
import { Input }                       from '../ui/input';
import { Button }                      from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function CarFilters() {
  const router     = useRouter();
  const params     = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value && value !== 'all') {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    p.delete('page'); // reset page on filter change
    router.push(`?${p.toString()}`);
  }, [params, router]);

  const reset = () => router.push('?');

  return (
    <div className="flex flex-wrap gap-3 items-center">

      {/* Make / Brand */}
      <Input
        placeholder="الماركة"
        defaultValue={params.get('make') ?? ''}
        className="w-36"
        onChange={e => update('make', e.target.value)}
      />

      {/* Model */}
      <Input
        placeholder="الموديل"
        defaultValue={params.get('model') ?? ''}
        className="w-36"
        onChange={e => update('model', e.target.value)}
      />

      {/* Min price */}
      <Input
        type="number"
        placeholder="أقل سعر"
        defaultValue={params.get('minPrice') ?? ''}
        className="w-32"
        onChange={e => update('minPrice', e.target.value)}
      />

      {/* Max price */}
      <Input
        type="number"
        placeholder="أعلى سعر"
        defaultValue={params.get('maxPrice') ?? ''}
        className="w-32"
        onChange={e => update('maxPrice', e.target.value)}
      />

      {/* Year */}
      <Select
        defaultValue={params.get('minYear') ?? 'all'}
        onValueChange={v => update('minYear', v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="السنة من" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل السنوات</SelectItem>
          {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      <Button variant="outline" size="sm" onClick={reset}>
        إعادة ضبط
      </Button>
    </div>
  );
}