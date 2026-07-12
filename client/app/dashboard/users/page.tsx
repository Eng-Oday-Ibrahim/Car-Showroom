'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { AuthGate } from '../../../components/auth/auth-gate';
import { Button } from '../../../components/ui/button';
import { TableSkeleton } from '../../../components/shared/skeletons';
import { getStoredAuth } from '../../../lib/auth/auth';
import { useI18n } from '@/lib/i18n';

interface UserRecord {
  id: string;
  _id?:string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt?: string;
}

interface UsersResponse {
  success: boolean;
  data: UserRecord[];
  total: number;
  page: number;
  perPage: number;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function DashboardUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    const auth = getStoredAuth();
    if (!auth.token) {
      setUsers([]);
      setError(t('dashboardUsers.errorSignInAgain'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users?page=1&perPage=100`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const payload = (await response.json()) as UsersResponse;
      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? 'Unable to load users');
      }

      setUsers(payload.data ?? []);
      setTotal(payload.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboardUsers.errorLoadUsers'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  return (
    <AuthGate requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{t('dashboardUsers.title')}</h1>
            <p className="text-sm text-gray-500">
              {loading ? t('dashboardUsers.loadingTitle') : `${total.toLocaleString('en')} ${t('dashboardUsers.usersFound')}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadUsers()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('dashboardUsers.refresh')}
            </Button>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              {t('dashboardUsers.backToDashboard')}
            </Link>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={8} />
        ) : error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">{t('dashboardUsers.table.name')}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">{t('dashboardUsers.table.email')}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">{t('dashboardUsers.table.role')}</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">{t('dashboardUsers.table.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => (
                    <tr key={user._id || user.id || `${user.email}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role === 'admin' ? t('dashboardUsers.roleAdmin') : t('dashboardUsers.roleUser')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.isActive ? t('dashboardUsers.statusActive') : t('dashboardUsers.statusInactive')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}
