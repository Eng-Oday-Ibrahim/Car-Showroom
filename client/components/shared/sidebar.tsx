'use client';

import Link           from 'next/link';
import { usePathname } from 'next/navigation';
import { cn }          from '../../lib/utils';
import { Layout, Plus, Car, Settings2, Users } from 'lucide-react';
import { useI18n }     from '@/lib/i18n';

const links = [
  { href: '/dashboard',           icon: Layout,   labelKey: 'sidebar.dashboard' },
  { href: '/dashboard/cars',      icon: Car,      labelKey: 'sidebar.cars' },
  { href: '/dashboard/cars/new',  icon: Plus,     labelKey: 'sidebar.addCar' },
  { href: '/dashboard/users',     icon: Users,    labelKey: 'sidebar.users' },
  { href: '/dashboard/settings',  icon: Settings2,labelKey: 'sidebar.settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="w-56 shrink-0 border-l border-gray-200 bg-white min-h-screen">
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900"> Cars Gallery</span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">{t('sidebar.headerSubtitle')}</p>
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
              {<link.icon className="h-4 w-4" />}
              <span>{t(link.labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
