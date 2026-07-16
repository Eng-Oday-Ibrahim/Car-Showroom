'use client';

import { useEffect, useState } from 'react';
import { settingsApi } from '@/lib/api/settings.api';
import { Button } from '@/components/ui/button';
import { Settings2, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  /* ── Load current credentials ── */
  useEffect(() => {
    void (async () => {
      try {
        const creds = await settingsApi.getDubicarsCredentials();
        setEmail(creds.email);
        setPassword('');          // password is masked — don't pre-fill
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Save credentials ── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await settingsApi.updateDubicarsCredentials(email.trim(), password);
      setSuccess('DubiCars credentials updated successfully! Changes take effect on the next sync.');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-gray-400" />
          Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage integration credentials and system settings
        </p>
      </div>

      {/* DubiCars Credentials Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white border border-gray-100 p-6 space-y-6"
      >
        {/* Card header */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-50 text-amber-700 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">DubiCars Integration</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Update the credentials used to sync cars from DubiCars.
              Changes take effect on the next sync without restarting the server.
            </p>
          </div>
        </div>

        {/* Feedback banners */}
        {success && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-9 w-28 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="dubicars-email" className="block text-sm font-medium text-gray-700">
                DubiCars Email
              </label>
              <input
                id="dubicars-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="dubicars-password" className="block text-sm font-medium text-gray-700">
                DubiCars Password
              </label>
              <div className="relative">
                <input
                  id="dubicars-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password to update"
                  className="w-full border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Leave blank to keep the current password unchanged — but you must enter a password to save.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Credentials'
                )}
              </Button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Info box */}
      <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 space-y-1">
        <p>
          <strong className="text-gray-600">Note:</strong> Credentials are stored securely in the database.
          The environment variable fallback is only used when no DB credentials have been set yet.
        </p>
      </div>

    </div>
  );
}
