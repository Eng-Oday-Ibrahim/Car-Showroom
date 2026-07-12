import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded bg-gray-200', className)} style={style} />
  );
}

// ── Car Card Skeleton ─────────────────────────────────────

export function CarCardSkeleton() {
  return (
    <div className="rounded overflow-hidden border border-gray-200 bg-white">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

// ── Cars Grid Skeleton ────────────────────────────────────

export function CarsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Table Skeleton ────────────────────────────────────────

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="rounded border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex gap-4">
        {[140, 60, 100, 90, 80, 80].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: w }} />
        ))}
      </div>
      <div className="divide-y divide-gray-100 bg-white">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex gap-4 items-center">
            <Skeleton className="h-10 w-14 rounded shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Detail Page Skeleton ──────────────────────────────────

export function CarDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-4 gap-2">
        <Skeleton className="col-span-3 h-80 rounded" />
        <div className="flex flex-col gap-2">
          <Skeleton className="flex-1 rounded" />
          <Skeleton className="flex-1 rounded" />
          <Skeleton className="flex-1 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 rounded" />)}
          </div>
        </div>
        <Skeleton className="h-64 rounded" />
      </div>
    </div>
  );
}

// ── Stats Skeleton ────────────────────────────────────────

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded" />
      ))}
    </div>
  );
}