import type { Metadata } from 'next';
import { AuthGate } from '../../../components/auth/auth-gate';

export const metadata: Metadata = { title: 'لوحة المستخدم' };

export default function UserDashboardPage() {
  return (
    <AuthGate>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">لوحة المستخدم</h1>
        <p className="text-gray-600">هذه الصفحة متاحة للمستخدمين العاديين.</p>
      </div>
    </AuthGate>
  );
}
