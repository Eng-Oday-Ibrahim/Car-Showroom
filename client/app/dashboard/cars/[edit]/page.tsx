import type { Metadata } from 'next';
import Link              from 'next/link';
import { notFound }      from 'next/navigation';
import { carsApi }       from '../../../../lib/api/cars.api';
import { CarForm }       from '../../../../components/cars/car-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id }   = await params;
    const { data } = await carsApi.getById(id);
    return { title: `تعديل — ${data.make} ${data.model} ${data.year}` };
  } catch {
    return { title: 'تعديل سيارة' };
  }
}

export default async function EditCarPage({ params }: PageProps) {
  const { id } = await params;

  let car;
  try {
    const res = await carsApi.getById(id);
    car = res.data;
  } catch {
    notFound();
  }

  // سيارات دبي كار — للقراءة فقط
  if (car.source === 'dubicars') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-gray-700">الرئيسية</Link>
          <span>/</span>
          <Link href="/dashboard/cars" className="hover:text-gray-700">السيارات</Link>
          <span>/</span>
          <span className="text-gray-700">تعديل</span>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center space-y-4">
          <p className="text-4xl">🔗</p>
          <h2 className="text-xl font-bold text-gray-800">هذه السيارة من دبي كار</h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
            سيارات دبي كار لا يمكن تعديلها يدوياً.
            أي تغيير في حسابك على دبي كار سيظهر تلقائياً عند المزامنة التالية.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/cars">
              <button className="px-5 py-2 text-sm border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                ← العودة للقائمة
              </button>
            </Link>
            <Link href="/dashboard/sync">
              <button className="px-5 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors">
                🔄 مزامنة الآن
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link href="/dashboard" className="hover:text-gray-700">الرئيسية</Link>
            <span>/</span>
            <Link href="/dashboard/cars" className="hover:text-gray-700">السيارات</Link>
            <span>/</span>
            <span className="text-gray-700">تعديل</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل السيارة</h1>
          <p className="text-sm text-gray-400 mt-1">
            {car.make} {car.model} {car.year}
            {car.trim && ` — ${car.trim}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/cars/${car.id}`} target="_blank">
            <button className="text-sm text-gray-400 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl transition-colors">
              ↗ عرض في الموقع
            </button>
          </Link>
          <Link href="/dashboard/cars">
            <button className="text-sm text-gray-400 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl transition-colors">
              ← العودة
            </button>
          </Link>
        </div>
      </div>

      {/* Status banner */}
      <div className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
        car.status === 'active'  ? 'bg-green-50 text-green-700 border border-green-100'   :
        car.status === 'paused'  ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
        car.status === 'sold'    ? 'bg-blue-50 text-blue-700 border border-blue-100'       :
        'bg-red-50 text-red-700 border border-red-100'
      }`}>
        <span>
          {car.status === 'active' ? '✅ نشطة — تظهر للزوار' :
           car.status === 'paused' ? '⏸️ موقوفة — مخفية عن الزوار' :
           car.status === 'sold'   ? '🏷️ مباعة' : '🗑️ محذوفة'}
        </span>
      </div>

      <CarForm car={car} />

    </div>
  );
}