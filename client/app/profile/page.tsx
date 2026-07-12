'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, Heart, LogOut, ArrowRight } from 'lucide-react';
import { clearAuth, getCurrentUser, getSavedCarIds, getStoredAuth } from '../../lib/auth/auth';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function ProfilePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [auth, setAuth] = useState(getStoredAuth());
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const current = getStoredAuth();
      setAuth(current);
      if (!current.token) {
        router.replace('/login');
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        clearAuth();
        router.replace('/login');
        return;
      }

      setAuth({ token: current.token, user });
      setSavedCount((await getSavedCarIds(user.id)).length);
    };

    void loadProfile();
  }, [router]);

  if (!auth.user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded bg-gray-900 text-white shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{auth.user.name}</h1>
            <p className="text-sm text-gray-500">{auth.user.email}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {auth.user.role === 'admin' ? t('profile.roleAdmin') : t('profile.roleCustomer')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            clearAuth();
            router.replace('/');
          }}
          className="inline-flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          {t('profile.logout')}
        </button>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{t('profile.accountTitle')}</h2>

        <Link
          href="/profile/saved"
          className="flex items-center justify-between py-4 border-b border-gray-100 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{t('profile.savedCars')}</p>
              <p className="text-xs text-gray-400">{savedCount} {t('profile.savedCount')}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300" />
        </Link>
      </div>

    </div>
  );
}