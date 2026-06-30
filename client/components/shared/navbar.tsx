"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { clearAuth, getStoredAuth, isAdmin } from '../../lib/auth/auth';

export function Navbar() {
  const [auth, setAuth] = useState(getStoredAuth());

  useEffect(() => {
    setAuth(getStoredAuth());
  }, []);

  function handleLogout() {
    clearAuth();
    setAuth({ token: null, user: null });
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">🚗 معرض السيارات</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            السيارات
          </Link>
          {auth.user ? (
            <>
              <Link href={isAdmin(auth.user) ? '/dashboard' : '/dashboard/user'} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {isAdmin(auth.user) ? 'لوحة الإدارة' : 'لوحة المستخدم'}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>تسجيل الخروج</Button>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button variant="outline" size="sm">تسجيل الدخول</Button>
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}