'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n';
import { formatPrice, formatKm } from '../../lib/utils';
import { CarGallery } from './car-gallery';
import { SaveCarButton } from './save-car-button';
import { Calendar, Pin, Settings, Fuel, Palette, Phone, Shield, MessageCircle } from 'lucide-react';
import type { Car } from '../../types/car.types';

export function CarDetailsContent({ car }: { car: Car }) {
  const { t, locale, dir } = useI18n();

  const specs = [
    { label: t('carDetails.specs.year'), value: String(car.year) },
    { label: t('carDetails.specs.kilometers'), value: formatKm(car.kmDriven) },
    { label: t('carDetails.specs.bodyType'), value: car.bodyType },
    { label: t('carDetails.specs.fuelType'), value: car.fuelType },
    { label: t('carDetails.specs.transmission'), value: car.transmission },
    { label: t('carDetails.specs.cylinders'), value: car.cylinders ? String(car.cylinders) : null },
    { label: t('carDetails.specs.driveType'), value: car.driveType },
    { label: t('carDetails.specs.engineSize'), value: car.engineSize },
    { label: t('carDetails.specs.horsePower'), value: car.horsePower ? String(car.horsePower) : null },
    { label: t('carDetails.specs.seats'), value: car.seats ? String(car.seats) : null },
    { label: t('carDetails.specs.doors'), value: car.doors ? String(car.doors) : null },
    { label: t('carDetails.specs.exteriorColor'), value: car.color },
    { label: t('carDetails.specs.interiorColor'), value: car.interiorColor },
    { label: t('carDetails.specs.steeringSide'), value: car.steeringSide === 'left' ? t('carDetails.left') : car.steeringSide === 'right' ? t('carDetails.right') : car.steeringSide },
    { label: t('carDetails.specs.regionalSpecs'), value: car.regionalSpecs },
    { label: t('carDetails.specs.bodyCondition'), value: car.bodyCondition },
    { label: t('carDetails.specs.mechanicalCondition'), value: car.mechanicalCondition },
    { label: t('carDetails.specs.warranty'), value: car.warranty ? `${t('carDetails.yes')}${car.warrantyMonths ? ` — ${car.warrantyMonths}` : ''}` : t('carDetails.no') },
    { label: t('carDetails.specs.wheelSize'), value: car.wheelSize },
  ].filter(s => s.value != null && s.value !== '');

  const primaryDescription = locale === 'ar' ? (car.descriptionAr || car.descriptionEn) : (car.descriptionEn || car.descriptionAr);
  const secondaryDescription = locale === 'ar' && car.descriptionEn && car.descriptionAr ? car.descriptionEn : locale !== 'ar' && car.descriptionAr && car.descriptionEn ? car.descriptionAr : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">

      {/* Breadcrumb */}
      <nav className="text-xs tracking-wide uppercase text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900 transition-colors">{t('navbar.home')}</Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-gray-900 transition-colors">{t('navbar.cars')}</Link>
        <span>/</span>
        <span className="text-gray-600">{car.make} {car.model}</span>
      </nav>

      {/* Gallery */}
      <CarGallery images={car.images} title={`${car.make} ${car.model}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* ── Left: Details ── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide uppercase text-gray-400">
              {car.kmDriven === 0 && <span className="text-gray-900 font-semibold">{t('carDetails.new')}</span>}
              {car.regionalSpecs && <span>{car.regionalSpecs}</span>}
              {car.warranty && <span className="text-emerald-700 font-medium">{t('carDetails.warrantyIncluded')}</span>}
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
              {car.make} {car.model}
              {car.trim && <span className="text-gray-400 font-normal"> — {car.trim}</span>}
            </h1>
            <p className="text-gray-400">{car.year}</p>
          </div>

          {/* Quick specs row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-6 border-y border-gray-100">
            {[
              { icon: <Calendar className="w-4 h-4" />, label: t('carDetails.specs.year'), value: String(car.year) },
              { icon: <Pin className="w-4 h-4" />, label: t('carDetails.specs.kilometers'), value: formatKm(car.kmDriven) },
              { icon: <Fuel className="w-4 h-4" />, label: t('carDetails.specs.fuelType'), value: car.fuelType },
              { icon: <Settings className="w-4 h-4" />, label: t('carDetails.specs.transmission'), value: car.transmission },
            ].filter(s => s.value).map(s => (
              <div key={s.label} className="space-y-1.5">
                <span className="text-gray-300">{s.icon}</span>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-sm font-medium text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Full specs */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">
              {t('carDetails.specifications')}
            </h2>
            <dl className="divide-y divide-gray-100">
              {specs.map(spec => (
                <div key={spec.label} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-gray-400">{spec.label}</dt>
                  <dd className="font-medium text-gray-900 text-end">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">
                {t('carDetails.features')}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {car.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {primaryDescription && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">
                {t('carDetails.description')}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{primaryDescription}</p>
              {secondaryDescription && (
                <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap mt-4 pt-4 border-t border-gray-100" dir={dir === 'rtl' ? 'ltr' : 'rtl'}>
                  {secondaryDescription}
                </p>
              )}
            </div>
          )}

          {/* Additional info */}
          {(car.additionalInfoAr || car.additionalInfoEn) && (
            <div className="border-l-2 border-gray-200 pl-4 text-sm text-gray-500 space-y-1">
              {locale === 'ar' ? (
                <>
                  {car.additionalInfoAr && <p>{car.additionalInfoAr}</p>}
                  {car.additionalInfoEn && <p dir="ltr">{car.additionalInfoEn}</p>}
                </>
              ) : (
                <>
                  {car.additionalInfoEn && <p>{car.additionalInfoEn}</p>}
                  {car.additionalInfoAr && <p dir="rtl">{car.additionalInfoAr}</p>}
                </>
              )}
            </div>
          )}

        </div>

        {/* ── Right: Price card ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 bg-white p-6 border border-gray-100 shadow-xs">

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-gray-900 tracking-tight">{formatPrice(car.price)}</p>
                {car.kmDriven > 0 && (
                  <p className="text-sm text-gray-400 mt-1">{formatKm(car.kmDriven)}</p>
                )}
              </div>
              <SaveCarButton carId={car.id} />
            </div>

            <ul className="space-y-2.5 text-sm text-gray-600 border-y border-gray-100 py-5">
              {car.fuelType && <li className="flex items-center gap-2.5"><Fuel className="w-4 h-4 text-gray-400 shrink-0" />{car.fuelType}</li>}
              {car.transmission && <li className="flex items-center gap-2.5"><Settings className="w-4 h-4 text-gray-400 shrink-0" />{car.transmission}</li>}
              {car.regionalSpecs && <li className="flex items-center gap-2.5"><Pin className="w-4 h-4 text-gray-400 shrink-0" />{car.regionalSpecs}</li>}
              {car.color && <li className="flex items-center gap-2.5"><Palette className="w-4 h-4 text-gray-400 shrink-0" />{car.color}</li>}
              {car.warranty && (
                <li className="flex items-center gap-2.5 text-gray-900 font-medium">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t('carDetails.guarantee')}{car.warrantyMonths ? ` — ${car.warrantyMonths}` : ''}
                </li>
              )}
            </ul>

            <div className="space-y-2.5">
              <a
                href="tel:+971543141978"
                className="flex items-center justify-center gap-2 w-full bg-[#050505] text-white py-3 text-sm font-medium hover:bg-[#050505]/80 transition-colors"
              >
                <Phone className="w-4 h-4" /> {t('carDetails.contactUs')}
              </a>
              <a
                href="https://wa.me/971543141978"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-900 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> {t('carDetails.whatsapp')}
              </a>
            </div>

            {car.adReference && (
              <p className="text-xs text-gray-400 text-center">
                {t('carDetails.adNumber', { ref: car.adReference })}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Back link */}
      <div className="pt-4 border-t border-gray-100">
        <Link href="/cars" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          {dir === 'rtl' ? '→' : '←'} {t('carDetails.backToList')}
        </Link>
      </div>

    </div>
  );
}
