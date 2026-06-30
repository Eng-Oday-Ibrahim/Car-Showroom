'use client';

import { useState }        from 'react';
import { useRouter }       from 'next/navigation';
import type { Car, CreateCarInput } from '../../types/car.types';
import { carsApi }         from '../../lib/api/cars.api';
import { Button }          from '../ui/button';
import { Input }           from '../ui/input';
import { Label }           from '../ui/label';
import { Textarea }        from '../ui/textarea';
import { Switch }          from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface CarFormProps {
  car?: Car;   // إذا موجود → وضع التعديل
}

type FormData = Partial<CreateCarInput>;

export function CarForm({ car }: CarFormProps) {
  const router  = useRouter();
  const isEdit  = !!car;

  const [data,    setData]    = useState<FormData>({
    make:          car?.make          ?? '',
    model:         car?.model         ?? '',
    year:          car?.year          ?? new Date().getFullYear(),
    price:         car?.price         ?? 0,
    kmDriven:      car?.kmDriven      ?? 0,
    trim:          car?.trim          ?? '',
    color:         car?.color         ?? '',
    bodyType:      car?.bodyType      ?? '',
    fuelType:      car?.fuelType      ?? '',
    transmission:  car?.transmission  ?? '',
    regionalSpecs: car?.regionalSpecs ?? '',
    steeringSide:  car?.steeringSide  ?? 'left',
    warranty:      car?.warranty      ?? false,
    warrantyMonths: car?.warrantyMonths ?? '',
    descriptionEn: car?.descriptionEn ?? '',
    descriptionAr: car?.descriptionAr ?? '',
    images:        car?.images        ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [imgInput, setImgInput] = useState('');

  const set = (key: keyof FormData, value: unknown) =>
    setData(prev => ({ ...prev, [key]: value }));

  const addImage = () => {
    if (!imgInput.trim()) return;
    set('images', [...(data.images ?? []), imgInput.trim()]);
    setImgInput('');
  };

  const removeImage = (idx: number) =>
    set('images', (data.images ?? []).filter((_, i) => i !== idx));

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await carsApi.update(car.id, data);
      } else {
        await carsApi.create(data as CreateCarInput);
      }
      router.push('/dashboard/cars');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── المعلومات الأساسية ── */}
      <Card>
        <CardHeader><CardTitle>المعلومات الأساسية</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">

          <div className="space-y-1">
            <Label>الماركة *</Label>
            <Input value={data.make} onChange={e => set('make', e.target.value)} placeholder="Toyota" />
          </div>

          <div className="space-y-1">
            <Label>الموديل *</Label>
            <Input value={data.model} onChange={e => set('model', e.target.value)} placeholder="Land Cruiser" />
          </div>

          <div className="space-y-1">
            <Label>السنة *</Label>
            <Input type="number" value={data.year} onChange={e => set('year', Number(e.target.value))} />
          </div>

          <div className="space-y-1">
            <Label>الترم / الفئة</Label>
            <Input value={data.trim ?? ''} onChange={e => set('trim', e.target.value)} placeholder="VXR" />
          </div>

          <div className="space-y-1">
            <Label>السعر (AED) *</Label>
            <Input type="number" value={data.price} onChange={e => set('price', Number(e.target.value))} />
          </div>

          <div className="space-y-1">
            <Label>الكيلومترات</Label>
            <Input type="number" value={data.kmDriven} onChange={e => set('kmDriven', Number(e.target.value))} />
          </div>

        </CardContent>
      </Card>

      {/* ── المواصفات ── */}
      <Card>
        <CardHeader><CardTitle>المواصفات</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">

          <div className="space-y-1">
            <Label>اللون</Label>
            <Input value={data.color ?? ''} onChange={e => set('color', e.target.value)} placeholder="أبيض" />
          </div>

          <div className="space-y-1">
            <Label>نوع الهيكل</Label>
            <Input value={data.bodyType ?? ''} onChange={e => set('bodyType', e.target.value)} placeholder="SUV" />
          </div>

          <div className="space-y-1">
            <Label>نوع الوقود</Label>
            <Select value={data.fuelType ?? ''} onValueChange={v => set('fuelType', v)}>
              <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">بنزين</SelectItem>
                <SelectItem value="Diesel">ديزل</SelectItem>
                <SelectItem value="Electric">كهربائي</SelectItem>
                <SelectItem value="Hybrid">هايبرد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>ناقل الحركة</Label>
            <Select value={data.transmission ?? ''} onValueChange={v => set('transmission', v)}>
              <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">أوتوماتيك</SelectItem>
                <SelectItem value="Manual">يدوي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>المواصفات الإقليمية</Label>
            <Input value={data.regionalSpecs ?? ''} onChange={e => set('regionalSpecs', e.target.value)} placeholder="GCC" />
          </div>

          <div className="space-y-1">
            <Label>جهة القيادة</Label>
            <Select value={data.steeringSide} onValueChange={v => set('steeringSide', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">يسار</SelectItem>
                <SelectItem value="right">يمين</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
      </Card>

      {/* ── الضمان ── */}
      <Card>
        <CardHeader><CardTitle>الضمان</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={data.warranty}
              onCheckedChange={v => set('warranty', v)}
            />
            <Label>يوجد ضمان</Label>
          </div>
          {data.warranty && (
            <div className="space-y-1">
              <Label>مدة الضمان</Label>
              <Input
                value={data.warrantyMonths ?? ''}
                onChange={e => set('warrantyMonths', e.target.value)}
                placeholder="12 شهر"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── الوصف ── */}
      <Card>
        <CardHeader><CardTitle>الوصف</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>الوصف (عربي)</Label>
            <Textarea
              value={data.descriptionAr ?? ''}
              onChange={e => set('descriptionAr', e.target.value)}
              rows={3}
              placeholder="وصف السيارة بالعربية..."
            />
          </div>
          <div className="space-y-1">
            <Label>الوصف (إنجليزي)</Label>
            <Textarea
              value={data.descriptionEn ?? ''}
              onChange={e => set('descriptionEn', e.target.value)}
              rows={3}
              placeholder="Car description in English..."
            />
          </div>
        </CardContent>
      </Card>

      {/* ── الصور ── */}
      <Card>
        <CardHeader><CardTitle>الصور</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={imgInput}
              onChange={e => setImgInput(e.target.value)}
              placeholder="https://example.com/car.jpg"
              onKeyDown={e => e.key === 'Enter' && addImage()}
            />
            <Button type="button" variant="outline" onClick={addImage}>إضافة</Button>
          </div>
          {(data.images ?? []).length === 0 && (
            <p className="text-sm text-gray-400">لا توجد صور — يُنصح بإضافة 4 صور على الأقل</p>
          )}
          <div className="space-y-2">
            {(data.images ?? []).map((url, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-2">
                <span className="flex-1 truncate text-gray-600">{url}</span>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Actions ── */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          إلغاء
        </Button>
        <Button onClick={submit} disabled={loading}>
          {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة السيارة'}
        </Button>
      </div>

    </div>
  );
}