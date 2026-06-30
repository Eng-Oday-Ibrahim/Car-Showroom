import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CarStatus, CarSource } from '../types/car.types';

// ── shadcn/ui required ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Formatters ────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AE', {
    style:    'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatKm(km: number): string {
  return km === 0 ? 'Brand New' : `${new Intl.NumberFormat('en').format(km)} km`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ar-AE', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(new Date(date));
}

// ── Status helpers ────────────────────────────────────────

export const STATUS_LABELS: Record<CarStatus, string> = {
  active:  'نشط',
  paused:  'موقوف',
  sold:    'مباع',
  deleted: 'محذوف',
};

export const STATUS_COLORS: Record<CarStatus, string> = {
  active:  'bg-green-100 text-green-800',
  paused:  'bg-yellow-100 text-yellow-800',
  sold:    'bg-blue-100 text-blue-800',
  deleted: 'bg-red-100 text-red-800',
};

export const SOURCE_LABELS: Record<CarSource, string> = {
  local:    'محلي',
  dubicars: 'دبي كار',
};

export const SOURCE_COLORS: Record<CarSource, string> = {
  local:    'bg-purple-100 text-purple-800',
  dubicars: 'bg-orange-100 text-orange-800',
};