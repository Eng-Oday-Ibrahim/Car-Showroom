import type { Metadata } from 'next';
import Link              from 'next/link';
import { CarForm }       from '../../../../components/cars/car-form';

export const metadata: Metadata = { title: 'إضافة سيارة جديدة' };

export default function NewCarPage() {
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
            <span className="text-gray-700">إضافة جديد</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">إضافة سيارة جديدة</h1>
          <p className="text-sm text-gray-400 mt-1">تُحفظ السيارة في الموقع فقط</p>
        </div>
        <Link href="/dashboard/cars">
          <button className="text-sm text-gray-400 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-xl transition-colors">
            ← العودة
          </button>
        </Link>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
        <span className="mt-0.5">ℹ️</span>
        <p>
          السيارات المضافة من هنا تظهر في موقعك فقط.
          سيارات دبي كار تُجلب تلقائياً عبر <Link href="/dashboard/sync" className="underline">المزامنة</Link>.
        </p>
      </div>

      <CarForm />

    </div>
  );
}