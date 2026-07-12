'use client';

import { useState } from 'react';
import { carsApi } from '../../lib/api/cars.api';
import { Button } from '../ui/button';
import type { SyncResult } from '../../types/car.types';
import { CheckCircle2, AlertTriangle, Repeat } from 'lucide-react';

export function Sync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Sync Dubicars</h2>
          <p className="text-sm text-gray-400 mt-1">
            Click the button to sync cars with Dubicars and view the results immediately.
          </p>
          {lastSynced && (
            <p className="text-xs text-gray-500 mt-2"> Last Sync: {lastSynced}</p>
          )}
        </div>

        <Button onClick={runSync} disabled={loading} size="lg" className="w-full sm:w-auto h-12 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <Repeat className="h-4 w-4 animate-spin" />
               loading Sync...
            </span>
          ) : (
            'Sync Now'
          )}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200  p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-700">Sync failed</p>
              <p className="text-sm text-red-600 mt-1 break-words">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-100 p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">Sync completed successfully</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-white border border-green-100 p-3">
                <p className="text-2xl font-semibold text-green-700">{result.added}</p>
                <p className="text-xs text-green-600 mt-1">Added</p>
              </div>
              <div className="bg-white border border-green-100 p-3">
                <p className="text-2xl font-semibold text-blue-700">{result.updated}</p>
                <p className="text-xs text-blue-600 mt-1">Updated</p>
              </div>
              <div className="bg-white border border-green-100 p-3">
                <p className="text-2xl font-semibold text-red-700">{result.deleted}</p>
                <p className="text-xs text-red-600 mt-1">Deleted</p>
              </div>
            </div>
            {result.errors.length > 0 ? (
              <div className="bg-yellow-50 border border-yellow-100 p-3 text-sm text-yellow-700">
                <p className="font-medium">Partial sync completed with errors.</p>
                <p>{result.errors.length} ad(s) failed.</p>
              </div>
            ) : (
              <div className="bg-green-100 border border-green-200 p-3 text-sm text-green-700">
                No sync errors were reported.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
