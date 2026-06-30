'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAuth, type AuthUser } from '../../lib/auth/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@husseinghulam.com');
  const [password, setPassword] = useState('Admin123!');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const role: AuthUser['role'] = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    saveAuth({
      token: 'demo-token',
      user: {
        id: 'local-user',
        email,
        name: role === 'admin' ? 'Admin User' : 'Regular User',
        role,
      },
    });

    router.replace(role === 'admin' ? '/dashboard' : '/dashboard/user');
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
      <p className="text-sm text-gray-500">استخدم الحساب الإداري الافتراضي أو أي بريد يحتوي على admin.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded-xl border border-gray-300 px-4 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-gray-300 px-4 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white" type="submit">
          دخول
        </button>
      </form>
    </div>
  );
}
