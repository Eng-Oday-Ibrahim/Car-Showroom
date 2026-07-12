'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAuth, loginUser } from '../../lib/auth/auth';
import { Translate } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@husseinghulam.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      saveAuth({ token: result.token ?? null, user: result.user ?? null });
      router.replace(result.user?.role === 'admin' ? '/dashboard' : '/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded border border-gray-200 bg-white p-8 my-8">
      <h1 className="text-2xl font-bold text-gray-900">
        <Translate id="auth.loginTitle" />
      </h1>
      <p className="text-sm text-gray-500">
        <Translate id="auth.loginHelp" />
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border border-gray-300 px-4 py-2"
          placeholder={String(<Translate id="auth.emailPlaceholder" />)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border border-gray-300 px-4 py-2"
          placeholder={String(<Translate id="auth.passwordPlaceholder" />)}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-gray-900 px-4 py-2 text-white" type="submit" disabled={loading}>
          {loading ? <Translate id="auth.signingIn" /> : <Translate id="auth.loginTitle" />}
        </button>
      </form>
      <p className="text-sm text-gray-500">
        <Translate id="auth.createAccountText" />{' '}
        <Link href="/register" className="font-medium text-gray-900 underline">
          <Translate id="auth.createAccountLink" />
        </Link>
      </p>
    </div>
  );
}
