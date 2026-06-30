import type { Metadata }  from 'next';
import Image              from 'next/image';
import Link               from 'next/link';
import { notFound }       from 'next/navigation';
import { carsApi }        from '../../../lib/api/cars.api';
import { formatPrice, formatKm } from '../../../lib/utils';
import { Badge }          from '../../../components/ui/badge';

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
    return { title: ' Not Found a Car ' };
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
    { label: 'Year',            value: String(car.year) },
    { label: 'Kilometers',      value: formatKm(car.kmDriven) },
    { label: 'Body Type',       value: car.bodyType },
    { label: 'Fuel Type',       value: car.fuelType },
    { label: 'Transmission',      value: car.transmission },
    { label: 'Cylinders',   value: car.cylinders ? String(car.cylinders) : null },
    { label: 'Drive System',       value: car.driveType },
    { label: 'Engine Size',       value: car.engineSize },
    { label: 'Horsepower',     value: car.horsePower ? String(car.horsePower) : null },
    { label: 'Seats',      value: car.seats ? String(car.seats) : null },
    { label: 'Doors',      value: car.doors ? String(car.doors) : null },
    { label: 'Exterior Color',    value: car.color },
    { label: 'Interior Color',    value: car.interiorColor },
    { label: 'Steering Side',      value: car.steeringSide === 'left' ? 'Left' : 'Right' },
    { label: 'Regional Specs',         value: car.regionalSpecs },
    { label: 'Body Condition',      value: car.bodyCondition },
    { label: 'Mechanical Condition', value: car.mechanicalCondition },
    { label: 'Warranty',            value: car.warranty ? `Yes${car.warrantyMonths ? ` — ${car.warrantyMonths}` : ''}` : 'No' },
  ].filter(s => s.value != null && s.value !== '');

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-700">{car.make} {car.model}</span>
      </nav>

      {/* Image gallery */}
      {car.images.length > 0 ? (
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
          {/* Main image */}
          <div className="col-span-4 md:col-span-3 row-span-2 relative bg-gray-100">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Side thumbnails */}
          {car.images.slice(1, 3).map((img, i) => (
            <div key={i} className="hidden md:block relative bg-gray-100">
              <Image src={img} alt={`${car.make} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
          {/* More images badge */}
          {car.images.length > 3 && (
            <div className="hidden md:flex relative bg-gray-800 items-center justify-center">
              <span className="text-white text-lg font-semibold">+{car.images.length - 3}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-72 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
          <span className="text-5xl">🚗</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Details ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Title */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {car.kmDriven === 0 && (
                <Badge className="bg-green-100 text-green-700 border-0">New</Badge>
              )}
              {car.regionalSpecs && (
                <Badge variant="outline">{car.regionalSpecs}</Badge>
              )}
              {car.warranty && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">🛡️ Warranty</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {car.make} {car.model}
              {car.trim && <span className="text-gray-400 font-normal text-2xl"> — {car.trim}</span>}
            </h1>
            <p className="text-gray-500">{car.year}</p>
          </div>

          {/* Quick specs row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📅', label: 'Year',       value: car.year },
              { icon: '📍', label: 'Kilometers', value: formatKm(car.kmDriven) },
              { icon: '⛽', label: 'Fuel Type',       value: car.fuelType },
              { icon: '⚙️', label: 'Transmission', value: car.transmission },
            ].filter(s => s.value).map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl">{s.icon}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Full specs */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Full Specifications</h2>
            <div className="grid grid-cols-2 gap-2">
              {specs.map(spec => (
                <div key={spec.label} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl text-sm">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="font-medium text-gray-800">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Features & Additions</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {(car.descriptionAr || car.descriptionEn) && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Description</h2>
              {car.descriptionAr && (
                <p className="text-gray-600 leading-loose text-sm">{car.descriptionAr}</p>
              )}
              {car.descriptionEn && (
                <p className="text-gray-500 leading-loose text-sm mt-3" dir="ltr">{car.descriptionEn}</p>
              )}
            </div>
          )}

          {/* Additional info */}
          {(car.additionalInfoAr || car.additionalInfoEn) && (
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 space-y-1">
              {car.additionalInfoAr && <p>{car.additionalInfoAr}</p>}
              {car.additionalInfoEn && <p dir="ltr">{car.additionalInfoEn}</p>}
            </div>
          )}

        </div>

        {/* ── Right: Price card ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">

            <div>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(car.price)}</p>
              {car.kmDriven > 0 && (
                <p className="text-sm text-gray-400 mt-1">{formatKm(car.kmDriven)}</p>
              )}
            </div>

            <hr className="border-gray-100" />

            <ul className="space-y-2 text-sm text-gray-600">
              {car.fuelType      && <li className="flex items-center gap-2"><span>⛽</span>{car.fuelType}</li>}
              {car.transmission  && <li className="flex items-center gap-2"><span>⚙️</span>{car.transmission}</li>}
              {car.bodyType      && <li className="flex items-center gap-2"><span>🚗</span>{car.bodyType}</li>}
              {car.regionalSpecs && <li className="flex items-center gap-2"><span>🌍</span>{car.regionalSpecs}</li>}
              {car.color         && <li className="flex items-center gap-2"><span>🎨</span>{car.color}</li>}
              {car.warranty      && (
                <li className="flex items-center gap-2 text-blue-600">
                  <span>🛡️</span>a guarantee {car.warrantyMonths ?? ''}
                </li>
              )}
            </ul>

            <hr className="border-gray-100" />

            <a
              href="tel:+971000000000"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              📞 Contact Us
            </a>
            <a
              href="https://wa.me/971000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>

            {car.adReference && (
              <p className="text-xs text-gray-300 text-center">Ad Number: {car.adReference}</p>
            )}
          </div>
        </div>

      </div>

      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        ← Back to Car List
      </Link>

    </div>
  );
}
