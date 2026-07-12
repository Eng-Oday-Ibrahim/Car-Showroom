'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAuth, registerUser } from '../../lib/auth/auth';
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t('registerPage.errorMissingFields'));
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({ name: name.trim(), email: email.trim().toLowerCase(), password });
      saveAuth({
        token: result.token ?? null,
        user: result.user ?? null,
      });
      router.replace('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registerPage.errorCreateAccount'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded border border-gray-200 bg-white p-8 my-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('registerPage.title')}</h1>
      <p className="text-sm text-gray-500">{t('registerPage.description')}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border border-gray-300 px-4 py-2"
          placeholder={t('registerPage.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded border border-gray-300 px-4 py-2"
          placeholder={t('registerPage.emailPlaceholder')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border border-gray-300 px-4 py-2"
          placeholder={t('registerPage.passwordPlaceholder')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded bg-gray-900 px-4 py-2 text-white" type="submit" disabled={loading}>
          {loading ? t('registerPage.creatingAccount') : t('registerPage.createButton')}
        </button>
      </form>
      <p className="text-sm text-gray-500">
        {t('registerPage.alreadyHaveAccount')}{' '}
        <Link href="/login" className="font-medium text-gray-900 underline">
          {t('registerPage.signIn')}
        </Link>
      </p>
    </div>
  );
}
