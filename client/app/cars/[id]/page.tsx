import type { Metadata }  from 'next';
import Link               from 'next/link';
import { notFound }       from 'next/navigation';
import { carsApi }        from '../../../lib/api/cars.api';
import { formatPrice, formatKm } from '../../../lib/utils';
import { CarGallery }     from '../../../components/cars/car-gallery';
import { SaveCarButton } from '../../../components/cars/save-car-button';
import { Calendar, Pin, Settings, Fuel, Palette, Phone, Shield, MessageCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: car } = await carsApi.getById(id);
    return {
      title:       `${car.make} ${car.model} ${car.year}`,
      description: car.descriptionAr ?? `${car.make} ${car.model} ${car.year} — ${formatPrice(car.price)}`,
    };
  } catch {
    return { title: 'Not Found a Car' };
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;

  let car;
  try {
    const res = await carsApi.getById(id);
    car = res.data;
  } catch {
    notFound();
  }

  const specs = [
    { label: 'Year',                 value: String(car.year) },
    { label: 'Kilometers',           value: formatKm(car.kmDriven) },
    { label: 'Body Type',            value: car.bodyType },
    { label: 'Fuel Type',            value: car.fuelType },
    { label: 'Transmission',         value: car.transmission },
    { label: 'Cylinders',            value: car.cylinders ? String(car.cylinders) : null },
    { label: 'Drive System',         value: car.driveType },
    { label: 'Engine Size',          value: car.engineSize },
    { label: 'Horsepower',           value: car.horsePower ? String(car.horsePower) : null },
    { label: 'Seats',                value: car.seats ? String(car.seats) : null },
    { label: 'Doors',                value: car.doors ? String(car.doors) : null },
    { label: 'Exterior Color',       value: car.color },
    { label: 'Interior Color',       value: car.interiorColor },
    { label: 'Steering Side',        value: car.steeringSide === 'left' ? 'Left' : 'Right' },
    { label: 'Regional Specs',       value: car.regionalSpecs },
    { label: 'Body Condition',       value: car.bodyCondition },
    { label: 'Mechanical Condition', value: car.mechanicalCondition },
    { label: 'Warranty',             value: car.warranty ? `Yes${car.warrantyMonths ? ` — ${car.warrantyMonths}` : ''}` : 'No' },
  ].filter(s => s.value != null && s.value !== '');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

      {/* Breadcrumb */}
      <nav className="text-xs tracking-wide uppercase text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600">{car.make} {car.model}</span>
      </nav>

      {/* Gallery — every photo, scrollable thumbnails */}
      <CarGallery images={car.images} title={`${car.make} ${car.model}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* ── Left: Details ── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide uppercase text-gray-400">
              {car.kmDriven === 0 && <span className="text-gray-900">New</span>}
              {car.regionalSpecs && <span>{car.regionalSpecs}</span>}
              {car.warranty && <span>Warranty included</span>}
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
              {car.make} {car.model}
              {car.trim && <span className="text-gray-400 font-normal"> — {car.trim}</span>}
            </h1>
            <p className="text-gray-400">{car.year}</p>
          </div>

          {/* Quick specs row — plain, no boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-6 border-y border-gray-100">
            {[
              { icon: <Calendar className="w-4 h-4" />, label: 'Year',         value: car.year },
              { icon: <Pin className="w-4 h-4" />,      label: 'Kilometers',   value: formatKm(car.kmDriven) },
              { icon: <Fuel className="w-4 h-4" />,     label: 'Fuel Type',    value: car.fuelType },
              { icon: <Settings className="w-4 h-4" />, label: 'Transmission', value: car.transmission },
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
              Specifications
            </h2>
            <dl className="divide-y divide-gray-100">
              {specs.map(spec => (
                <div key={spec.label} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-gray-400">{spec.label}</dt>
                  <dd className="font-medium text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">
                Features &amp; Additions
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {car.features.map((f, i) => (
                  <span key={i}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {(car.descriptionAr || car.descriptionEn) && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">
                Description
              </h2>
              {car.descriptionAr && (
                <p className="text-gray-600 leading-loose text-sm">{car.descriptionAr}</p>
              )}
              {car.descriptionEn && (
                <p className="text-gray-500 leading-loose text-sm mt-4" dir="ltr">{car.descriptionEn}</p>
              )}
            </div>
          )}

          {/* Additional info */}
          {(car.additionalInfoAr || car.additionalInfoEn) && (
            <div className="border-l border-gray-200 pl-4 text-sm text-gray-500 space-y-1">
              {car.additionalInfoAr && <p>{car.additionalInfoAr}</p>}
              {car.additionalInfoEn && <p dir="ltr">{car.additionalInfoEn}</p>}
            </div>
          )}

        </div>

        {/* ── Right: Price card ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">

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
              {car.fuelType      && <li className="flex items-center gap-2.5"><Fuel className="w-4 h-4 text-gray-300" />{car.fuelType}</li>}
              {car.transmission  && <li className="flex items-center gap-2.5"><Settings className="w-4 h-4 text-gray-300" />{car.transmission}</li>}
              {car.regionalSpecs && <li className="flex items-center gap-2.5"><Pin className="w-4 h-4 text-gray-300" />{car.regionalSpecs}</li>}
              {car.color         && <li className="flex items-center gap-2.5"><Palette className="w-4 h-4 text-gray-300" />{car.color}</li>}
              {car.warranty      && (
                <li className="flex items-center gap-2.5 text-gray-900">
                  <Shield className="w-4 h-4" />
                  Guarantee{car.warrantyMonths ? ` — ${car.warrantyMonths}` : ''}
                </li>
              )}
            </ul>

            <div className="space-y-2.5">
              <a
                href="tel:+971543141978"
                className="flex items-center justify-center gap-2 w-full bg-[#050505] text-white py-3 text-sm font-medium hover:bg-[#050505]/80 transition-colors"
              >
                <Phone className="w-4 h-4" /> Contact Us
              </a>
              <a
                href="https://wa.me/971543141978"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-900 py-3 text-sm font-medium border-gray-300 hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {car.adReference && (
              <p className="text-xs text-gray-300 text-center">Ad Number: {car.adReference}</p>
            )}
          </div>
        </div>

      </div>

      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
        ← Back to Car List
      </Link>

    </div>
  );
}