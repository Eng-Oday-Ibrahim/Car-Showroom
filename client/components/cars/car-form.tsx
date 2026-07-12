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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CarImage } from './car-image';
import {
  Car as CarIcon, Settings2, ShieldCheck, FileText, ImageIcon,
  Upload, X, ArrowLeft, ArrowRight, Check,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface CarFormProps {
  car?: Car; // if provided → edit mode
}

type FormData = Partial<CreateCarInput>;

const STEPS = [
  { id: 'basic',       label: 'Basic Info',     icon: CarIcon },
  { id: 'specs',       label: 'Specifications', icon: Settings2 },
  { id: 'warranty',    label: 'Warranty',       icon: ShieldCheck },
  { id: 'description', label: 'Description',    icon: FileText },
  { id: 'images',      label: 'Photos',         icon: ImageIcon },
] as const;

type StepId = (typeof STEPS)[number]['id'];

export function CarForm({ car }: CarFormProps) {
  const { t } = useI18n();
  const router  = useRouter();
  const isEdit  = !!car;
  const initialDescription = car?.descriptionEn ?? car?.descriptionAr ?? '';

  const [step, setStep] = useState<StepId>('basic');
  const stepIndex   = STEPS.findIndex(s => s.id === step);
  const isFirstStep = stepIndex === 0;
  const isLastStep  = stepIndex === STEPS.length - 1;

  const [data,    setData]    = useState<FormData>({
    make:          car?.make          ?? '',
    model:         car?.model         ?? '',
    year:          car?.year          ?? new Date().getFullYear(),
    price:         car?.price         ?? undefined,
    kmDriven:      car?.kmDriven      ?? 0,
    trim:          car?.trim          ?? '',
    color:         car?.color         ?? '',
    interiorColor: car?.interiorColor ?? '',
    bodyType:      car?.bodyType      ?? '',
    fuelType:      car?.fuelType      ?? '',
    transmission:  car?.transmission  ?? '',
    cylinders:     car?.cylinders     ?? null,
    driveType:     car?.driveType     ?? '',
    engineSize:    car?.engineSize    ?? '',
    seats:         car?.seats         ?? null,
    doors:         car?.doors         ?? null,
    horsePower:    car?.horsePower    ?? null,
    wheelSize:     car?.wheelSize     ?? '',
    mechanicalCondition: car?.mechanicalCondition ?? '',
    bodyCondition: car?.bodyCondition ?? '',
    regionalSpecs: car?.regionalSpecs ?? '',
    steeringSide:  car?.steeringSide  ?? 'left',
    warranty:      car?.warranty      ?? false,
    warrantyMonths: car?.warrantyMonths ?? '',
    descriptionEn: initialDescription,
    descriptionAr: null,
    images:        car?.images        ?? [],
    features:      car?.features      ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const set = (key: keyof FormData, value: unknown) =>
    setData(prev => ({ ...prev, [key]: value }));

  const uploadImages = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;

    setUploadingImages(true);
    setError(null);
    try {
      const res = await carsApi.uploadImages(selectedFiles);
      set('images', [...(data.images ?? []), ...res.data.map(image => image.url)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('carForm.errorImageUploadFailed'));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (idx: number) =>
    set('images', (data.images ?? []).filter((_, i) => i !== idx));

  const goToStep = (target: StepId) => {
    setError(null);
    setStep(target);
  };

  const goNext = () => {
    if (isFirstStep && (!data.make?.trim() || !data.model?.trim())) {
      setError(t('carForm.errorMakeModelRequired'));
      return;
    }
    if (!isLastStep) goToStep(STEPS[stepIndex + 1].id);
  };

  const goBack = () => {
    if (!isFirstStep) goToStep(STEPS[stepIndex - 1].id);
  };

  const submit = async () => {
    // Validation
    if (!data.make?.trim()) {
      setError(t('carForm.errorMakeRequired'));
      goToStep('basic');
      return;
    }
    if (!data.model?.trim()) {
      setError(t('carForm.errorModelRequired'));
      goToStep('basic');
      return;
    }
    if (!data.year || data.year < 1900 || data.year > 2100) {
      setError(t('carForm.errorYearRange'));
      goToStep('basic');
      return;
    }
    if (data.price === undefined || data.price === null || data.price <= 0) {
      setError(t('carForm.errorPricePositive'));
      goToStep('basic');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = { ...data, descriptionAr: null };
      if (isEdit) {
        await carsApi.update(car.id, payload);
      } else {
        await carsApi.create(payload as CreateCarInput);
      }
      router.push('/dashboard/cars');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('carForm.errorSubmit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3  text-sm">
          {error}
        </div>
      )}

      <Tabs value={step} onValueChange={v => goToStep(v as StepId)}>

        {/* Step navigation */}
        <TabsList className="w-full h-auto p-0 bg-transparent border-b border-gray-100 justify-start gap-1">
          {STEPS.map((s, i) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="flex items-center gap-2 px-3 py-3 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-400 data-[state=active]:text-gray-900 transition-colors"
            >
              <span className={`w-5 h-5 flex items-center justify-center  text-xs shrink-0 ${
                i < stepIndex ? 'bg-gray-900 text-white' : i === stepIndex ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{t(`carForm.steps.${s.id}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Basic Info ── */}
        <TabsContent value="basic" className="pt-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.make')}</Label>
              <Input value={data.make} onChange={e => set('make', e.target.value)} placeholder={t('carForm.basic.makePlaceholder')} />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.model')}</Label>
              <Input value={data.model} onChange={e => set('model', e.target.value)} placeholder={t('carForm.basic.modelPlaceholder')} />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.year')}</Label>
              <Input type="number" value={data.year} onChange={e => set('year', Number(e.target.value))} />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.trim')}</Label>
              <Input value={data.trim ?? ''} onChange={e => set('trim', e.target.value)} placeholder={t('carForm.basic.trimPlaceholder')} />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.price')}</Label>
              <Input
                type="number"
                value={data.price && data.price > 0 ? data.price : ''}
                onChange={e => set('price', e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('carForm.basic.pricePlaceholder')}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.basic.kmDriven')}</Label>
              <Input
                type="number"
                value={data.kmDriven && data.kmDriven > 0 ? data.kmDriven : ''}
                onChange={e => set('kmDriven', e.target.value ? Number(e.target.value) : 0)}
                placeholder={t('carForm.basic.kmPlaceholder')}
              />
            </div>

          </div>
        </TabsContent>

        {/* ── Specifications ── */}
        <TabsContent value="specs" className="pt-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.exteriorColor')}</Label>
              <Input value={data.color ?? ''} onChange={e => set('color', e.target.value)} placeholder="White" />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.interiorColor')}</Label>
              <Input value={data.interiorColor ?? ''} onChange={e => set('interiorColor', e.target.value)} placeholder="Beige" />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.bodyType')}</Label>
              <Input value={data.bodyType ?? ''} onChange={e => set('bodyType', e.target.value)} placeholder="Sedan" />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.fuelType')}</Label>
              <Select value={data.fuelType ?? ''} onValueChange={v => set('fuelType', v)}>
                <SelectTrigger><SelectValue placeholder={t('carForm.specs.selectPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">{t('carForm.fuel.petrol')}</SelectItem>
                  <SelectItem value="Diesel">{t('carForm.fuel.diesel')}</SelectItem>
                  <SelectItem value="Electric">{t('carForm.fuel.electric')}</SelectItem>
                  <SelectItem value="Hybrid">{t('carForm.fuel.hybrid')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.transmission')}</Label>
              <Select value={data.transmission ?? ''} onValueChange={v => set('transmission', v)}>
                <SelectTrigger><SelectValue placeholder={t('carForm.specs.selectPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">{t('carForm.transmission.automatic')}</SelectItem>
                  <SelectItem value="Manual">{t('carForm.transmission.manual')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.driveType')}</Label>
              <Select value={data.driveType ?? ''} onValueChange={v => set('driveType', v)}>
                <SelectTrigger><SelectValue placeholder={t('carForm.specs.selectPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Front Wheel Drive">{t('carForm.drive.front')}</SelectItem>
                  <SelectItem value="Rear Wheel Drive">{t('carForm.drive.rear')}</SelectItem>
                  <SelectItem value="All Wheel Drive">{t('carForm.drive.all')}</SelectItem>
                  <SelectItem value="Four Wheel Drive">{t('carForm.drive.four')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.regionalSpecs')}</Label>
              <Input value={data.regionalSpecs ?? ''} onChange={e => set('regionalSpecs', e.target.value)} placeholder="GCC" />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.steeringSide')}</Label>
              <Select value={data.steeringSide} onValueChange={v => set('steeringSide', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">{t('carForm.steering.left')}</SelectItem>
                  <SelectItem value="right">{t('carForm.steering.right')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.engineSize')}</Label>
              <Input value={data.engineSize ?? ''} onChange={e => set('engineSize', e.target.value)} placeholder="2.0L" />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.cylinders')}</Label>
              <Input
                type="number"
                value={data.cylinders ?? ''}
                onChange={e => set('cylinders', e.target.value ? Number(e.target.value) : null)}
                placeholder="4"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.horsePower')}</Label>
              <Input
                type="number"
                value={data.horsePower ?? ''}
                onChange={e => set('horsePower', e.target.value ? Number(e.target.value) : null)}
                placeholder="200"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.seats')}</Label>
              <Input
                type="number"
                value={data.seats ?? ''}
                onChange={e => set('seats', e.target.value ? Number(e.target.value) : null)}
                placeholder="5"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.doors')}</Label>
              <Input
                type="number"
                value={data.doors ?? ''}
                onChange={e => set('doors', e.target.value ? Number(e.target.value) : null)}
                placeholder="4"
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t('carForm.specs.bodyCondition')}</Label>
              <Input value={data.bodyCondition ?? ''} onChange={e => set('bodyCondition', e.target.value)} placeholder="Perfect inside and out" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>{t('carForm.specs.mechanicalCondition')}</Label>
              <Input value={data.mechanicalCondition ?? ''} onChange={e => set('mechanicalCondition', e.target.value)} placeholder="Excellent" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label>{t('carForm.specs.features')}</Label>
              <Input
                value={(data.features ?? []).join(', ')}
                onChange={e => {
                  const parsed = e.target.value
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean);
                  set('features', parsed);
                }}
                placeholder="Sunroof, Leather Seats, Navigation"
              />
              <p className="text-xs text-gray-400">{t('carForm.specs.featuresHelp')}</p>
            </div>

          </div>
        </TabsContent>

        {/* ── Warranty ── */}
        <TabsContent value="warranty" className="pt-8 space-y-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={data.warranty}
              onCheckedChange={v => set('warranty', v)}
            />
            <Label>{t('carForm.warranty.available')}</Label>
          </div>
          {data.warranty && (
            <div className="space-y-1.5 max-w-xs">
              <Label>{t('carForm.warranty.duration')}</Label>
              <Input
                value={data.warrantyMonths ?? ''}
                onChange={e => set('warrantyMonths', e.target.value)}
                placeholder={t('carForm.warranty.durationPlaceholder')}
              />
            </div>
          )}
        </TabsContent>

        {/* ── Description ── */}
        <TabsContent value="description" className="pt-8 space-y-6">
          <div className="space-y-1.5">
            <Label>{t('carForm.description.arabic')}</Label>
            <Textarea
              value={data.descriptionAr ?? ''}
              onChange={e => set('descriptionAr', e.target.value)}
              rows={4}
              placeholder={t('carForm.description.arabicPlaceholder')}
              dir="rtl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('carForm.description.english')}</Label>
            <Textarea
              value={data.descriptionEn ?? ''}
              onChange={e => set('descriptionEn', e.target.value)}
              rows={4}
              placeholder={t('carForm.description.englishPlaceholder')}
            />
          </div>
        </TabsContent>

        {/* ── Images ── */}
        <TabsContent value="images" className="pt-8 space-y-5">

          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200  py-10 text-center cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-gray-600">
              {uploadingImages ? t('carForm.images.uploading') : t('carForm.images.uploadPrompt')}
            </span>
            <span className="text-xs text-gray-400">{t('carForm.images.accept')}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              disabled={uploadingImages}
              className="hidden"
              onChange={e => {
                void uploadImages(e.target.files);
                e.target.value = '';
              }}
            />
          </label>

          {(data.images ?? []).length === 0 ? (
            <p className="text-sm text-gray-400">{t('carForm.images.noImages')}</p>
          ) : (
            <div className="space-y-2">
              {(data.images ?? []).map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm bg-gray-50  px-3 py-2">
                  <div className="h-14 w-20 shrink-0 overflow-hidden bg-gray-100">
                    <CarImage src={url} alt={`Car image ${idx + 1}`} />
                  </div>
                  <span className="flex-1 truncate text-gray-600">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    aria-label="Remove image"
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>

      {/* ── Actions ── */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={() => router.back()} disabled={loading || uploadingImages}>
          {t('carForm.actions.cancel')}
        </Button>

        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button variant="outline" onClick={goBack} disabled={loading || uploadingImages}>
              <ArrowLeft className="w-4 h-4" /> {t('carForm.actions.back')}
            </Button>
          )}
          {!isLastStep ? (
            <Button onClick={goNext} disabled={loading || uploadingImages}>
              {t('carForm.actions.next')} <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={loading || uploadingImages}>
              {uploadingImages ? t('carForm.actions.uploading') : loading ? t('carForm.actions.saving') : isEdit ? t('carForm.actions.saveChanges') : t('carForm.actions.addCar')}
            </Button>
          )}
        </div>
      </div>

    </div>
  );
}
