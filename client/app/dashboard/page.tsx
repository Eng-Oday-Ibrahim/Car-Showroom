import type { Metadata } from 'next';
import Link              from 'next/link';
import { AuthGate }      from '../../components/auth/auth-gate';
import { formatPrice }   from '../../lib/utils';

export const metadata: Metadata = { title: 'لوحة التحكم' };

export default function DashboardPage() {
  const all = { total: 0 };
  const active = { total: 0 };
  const paused = { total: 0 };
  const sold = { total: 0 };
  const dubicars = { total: 0 };
  const local = { total: 0 };
  const recent = { data: [] as Array<{ id: string; make: string; model: string; year: number; source: string; trim?: string | null; price: number; status: string }> };

  const stats = [
    { label: 'إجمالي السيارات', value: all.total,      icon: '🚗', color: 'bg-gray-900 text-white',        href: '/dashboard/cars' },
    { label: 'نشطة',            value: active.total,    icon: '✅', color: 'bg-green-50 text-green-900',    href: '/dashboard/cars?status=active' },
    { label: 'موقوفة',          value: paused.total,    icon: '⏸️', color: 'bg-yellow-50 text-yellow-900',  href: '/dashboard/cars?status=paused' },
    { label: 'مباعة',           value: sold.total,      icon: '🏷️', color: 'bg-blue-50 text-blue-900',     href: '/dashboard/cars?status=sold' },
    { label: 'من دبي كار',      value: dubicars.total,  icon: '🔗', color: 'bg-orange-50 text-orange-900', href: '/dashboard/cars?source=dubicars' },
    { label: 'محلية',           value: local.total,     icon: '🏠', color: 'bg-purple-50 text-purple-900', href: '/dashboard/cars?source=local' },
  ];

  const quickActions = [
    { href: '/dashboard/cars/new', icon: '➕', label: 'إضافة سيارة',     desc: 'أضف سيارة محلية جديدة'        },
    { href: '/dashboard/cars',     icon: '📋', label: 'إدارة السيارات',  desc: 'عرض وتعديل كل السيارات'       },
    { href: '/dashboard/sync',     icon: '🔄', label: 'مزامنة دبي كار', desc: 'جلب آخر التحديثات تلقائياً'   },
  ];

  return (
    <AuthGate requireAdmin>
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-400 text-sm mt-1">نظرة عامة على أداء المعرض</p>
        </div>
        <Link
          href="/dashboard/sync"
          className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          🔄 مزامنة الآن
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href}>
            <div className={`rounded-2xl p-5 ${stat.color} hover:opacity-90 transition-opacity cursor-pointer`}>
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-3xl font-bold mt-3">{stat.value.toLocaleString('ar')}</p>
              <p className="text-sm mt-1 opacity-70">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quick actions */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-base font-semibold text-gray-800">إجراءات سريعة</h2>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:shadow-sm transition-all">
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">
                  {action.icon}
                </span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent cars */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">آخر السيارات المضافة</h2>
            <Link href="/dashboard/cars" className="text-sm text-gray-400 hover:text-gray-700">
              عرض الكل ←
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
            {recent.data.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                لا توجد سيارات بعد
              </div>
            ) : (
              recent.data.map(car => (
                <div key={car.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0 bg-green-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {car.make} {car.model} {car.year}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {car.source === 'dubicars' ? '🔗 دبي كار' : '🏠 محلي'}
                        {car.trim && ` · ${car.trim}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(car.price)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      car.status === 'active'  ? 'bg-green-100 text-green-700'  :
                      car.status === 'paused'  ? 'bg-yellow-100 text-yellow-700' :
                      car.status === 'sold'    ? 'bg-blue-100 text-blue-700'    :
                      'bg-red-100 text-red-700'
                    }`}>
                      { car.status === 'active' ? 'نشط' : car.status === 'paused' ? 'موقوف' : car.status === 'sold' ? 'مباع' : 'محذوف' }
                    </span>
                    <Link href={`/cars/${car.id}`} target="_blank" className="text-xs text-gray-300 hover:text-gray-600">
                      ↗
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
    </AuthGate>
  );
}
