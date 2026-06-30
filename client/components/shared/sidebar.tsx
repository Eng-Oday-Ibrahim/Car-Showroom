'use client';

import Link     from 'next/link';
import { usePathname } from 'next/navigation';
import { cn }   from '../../lib/utils';

const links = [
  { href: '/dashboard',           label: 'الرئيسية',   icon: '📊' },
  { href: '/dashboard/cars',      label: 'السيارات',   icon: '🚗' },
  { href: '/dashboard/cars/new',  label: 'إضافة سيارة', icon: '➕' },
  { href: '/dashboard/sync',      label: 'مزامنة دبي كار', icon: '🔄' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-l border-gray-200 bg-white min-h-screen">
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">🚗 المعرض</span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">لوحة التحكم</p>
      </div>

      <nav className="p-3 space-y-1">
        {links.map(link => {
          const isActive = link.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}