import type { Metadata } from 'next';
import { AuthGate } from '../../../components/auth/auth-gate';

export const metadata: Metadata = { title: 'لوحة الإدارة' };

export default function AdminDashboardPage() {
  return (
    <AuthGate requireAdmin>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
        <p className="text-gray-600">يمكن للمستخدمين الإداريين فقط الوصول إلى هذه الصفحة.</p>
      </div>
    </AuthGate>
  );
}
