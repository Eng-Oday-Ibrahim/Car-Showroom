'use client';

import { useState }  from 'react';
import Link          from 'next/link';
import { carsApi }   from '../../../lib/api/cars.api';
import { Button }    from '../../../components/ui/button';
import type { SyncResult } from '../../../types/car.types';
import { Trash, Edit, Plus, CloudSync } from 'lucide-react';

export default function SyncPage() {
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<SyncResult | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const runSync = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await carsApi.sync();
      setResult(res.data);
      setLastSynced(new Date().toLocaleTimeString('ar-AE'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشلت المزامنة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <Link href="/dashboard" className="hover:text-gray-700">الرئيسية</Link>
          <span>/</span>
          <span className="text-gray-700">مزامنة دبي كار</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">مزامنة دبي كار</h1>
        <p className="text-sm text-gray-400 mt-1">
          تعمل المزامنة تلقائياً كل ساعة — يمكنك أيضاً تشغيلها يدوياً في أي وقت
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">How It Works Sync</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: CloudSync, title: 'Get Ads',   desc: 'Get all your ads from Dubi Cars' },
            { icon: Plus, title: 'Add New',    desc: 'Automatically adds new listings'  },
            { icon: Edit, title: 'Update Existing',   desc: 'Updates information for modified vehicles'   },
            { icon: Trash, title: 'Delete Expired',    desc: 'Marks expired listings as "deleted"' },
          ].map(step => (
            <div key={step.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
              {<step.icon className="w-5 h-5" />}
              <div>
                <p className="text-sm font-medium text-gray-800">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync trigger */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800"> Work Sync</h2>
            {lastSynced && (
              <p className="text-xs text-gray-400 mt-1">  Last Sync Today: {lastSynced}</p>
            )}
          </div>
          {result && !loading && (
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              completed at {new Date().toLocaleTimeString('ar-AE')}
            </span>
          )}
        </div>

        <Button
          onClick={runSync}
          disabled={loading}
          size="lg"
          className="w-full h-12 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <span className="animate-spin inline-block">🔄</span>
             loading sync all Cars...
            </span>
          ) : (
           'Run Sync Now'
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-xl">❌</span>
          <div>
            <p className="font-medium text-red-700 text-sm">Sync Failed</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-400 text-xs mt-2">
              Please check your credentials in the Backend and try again.
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">

          <h2 className="text-base font-semibold text-gray-800">Sync Result</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{result.added}</p>
              <p className="text-xs text-green-600 mt-1.5 font-medium">New Cars Added</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-700">{result.updated}</p>
              <p className="text-xs text-blue-600 mt-1.5 font-medium">Cars Updated</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{result.deleted}</p>
              <p className="text-xs text-red-600 mt-1.5 font-medium">Cars Deleted</p>
            </div>
          </div>

          {result.added === 0 && result.updated === 0 && result.deleted === 0 && result.errors.length === 0 && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center">
              ✅ All data is up to date — no new changes
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ Partial Errors ({result.errors.length})
              </p>
              <p className="text-xs text-yellow-600">
                Partial sync completed — the following ads failed:
              </p>
              <div className="space-y-1 mt-2 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-700 bg-yellow-100 rounded-lg px-3 py-2">
                    <span className="font-mono shrink-0">#{e.dubicarsAdId}</span>
                    <span>{e.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/dashboard/cars" className="flex-1">
              <Button variant="outline" className="w-full">
                📋 View Cars
              </Button>
            </Link>
            <Button onClick={runSync} variant="ghost" className="flex-1" disabled={loading}>
              🔄 Run Sync Now
            </Button>
          </div>

        </div>
      )}

    </div>
  );
}