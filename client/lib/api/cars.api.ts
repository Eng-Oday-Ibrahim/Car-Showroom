import type {
  Car,
  CarFilters,
  CarStatusAction,
  CreateCarInput,
  PaginatedCars,
  SyncResult,
  UpdateCarInput,
} from '../../types/car.types';

// Resolve base URLs for both server-side and browser usage.
// - `NEXT_PUBLIC_API_URL` is used by browser bundles (should include `/api`).
// - `INTERNAL_API_URL` is used when code runs server-side (inside Docker) to reach the server container.
const clientEnv = process.env['NEXT_PUBLIC_API_URL']; // expected like 'http://localhost:4000/api'
const internalEnv = process.env['NEXT_PUBLIC_INTERNAL_API_URL']; // expected like 'http://cars-server:4000'

const stripTrailing = (u?: string) => (u ? u.replace(/\/+$/, '') : undefined);

const clientBase = stripTrailing(clientEnv);
const internalBase = stripTrailing(internalEnv);

let BASE_URL: string;
if (typeof window === 'undefined') {
  // Server-side (SSR): prefer internal host so container can reach the server by service name.
  const base = internalBase ?? (clientBase ? clientBase.replace(/\/api$/, '') : 'http://localhost:4000');
  BASE_URL = base.endsWith('/api') ? base : `${base}/api`;
} else {
  // Browser: prefer NEXT_PUBLIC_API_URL; otherwise use the current page origin.
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const base = clientBase ?? `${origin}/api`;
  BASE_URL = base.endsWith('/api') ? base : `${base}/api`;
}

// ── Base fetch wrapper ────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const json = await res.json() as {
    success: boolean;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
  } & T;

  if (!res.ok || !json.success) {
    // Include validation errors if present
    const errorDetails = json.errors
      ? '\n' + json.errors.map(e => `${e.field}: ${e.message}`).join('\n')
      : '';
    throw new Error((json.message ?? `API error ${res.status}`) + errorDetails);
  }

  return json;
}

async function uploadFetch<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body:   formData,
  });

  const json = await res.json() as {
    success: boolean;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
  } & T;

  if (!res.ok || !json.success) {
    const errorDetails = json.errors
      ? '\n' + json.errors.map(e => `${e.field}: ${e.message}`).join('\n')
      : '';
    throw new Error((json.message ?? `API error ${res.status}`) + errorDetails);
  }

  return json;
}

// ── Cars API ──────────────────────────────────────────────

export const carsApi = {

  // ── Public ──────────────────────────────────────────────

  // list cars with optional filters
  list(filters: CarFilters = {}): Promise<PaginatedCars> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null) params.set(k, String(v));
    });
    return apiFetch<PaginatedCars>(`/cars?${params.toString()}`);
  },

  // detailed information about a specific car by its ID
  getById(id: string): Promise<{ data: Car }> {
    return apiFetch<{ data: Car }>(`/cars/${id}`);
  },

  // ── Dashboard ────────────────────────────────────────────

  // admin dashboard: list all cars (active, paused, sold)
  listAll(filters: CarFilters = {}): Promise<PaginatedCars> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v != null) params.set(k, String(v));
    });
    return apiFetch<PaginatedCars>(`/cars/dashboard/all?${params.toString()}`);
  },

  // create a new car
  create(data: CreateCarInput): Promise<{ data: Car }> {
    return apiFetch<{ data: Car }>('/cars', {
      method: 'POST',
      body:   JSON.stringify(data),
    });
  },

  uploadImages(files: File[]): Promise<{ data: Array<{ filename: string; url: string }> }> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return uploadFetch<{ data: Array<{ filename: string; url: string }> }>('/uploads/images', formData);
  },

  // update a car's details
  update(id: string, data: UpdateCarInput): Promise<{ data: Car }> {
    return apiFetch<{ data: Car }>(`/cars/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(data),
    });
  },

 // update the status of a car (activate, pause, sold)
  setStatus(id: string, action: CarStatusAction): Promise<{ data: Car }> {
    return apiFetch<{ data: Car }>(`/cars/${id}/status`, {
      method: 'PATCH',
      body:   JSON.stringify({ action }),
    });
  },

 // -- remove a Car 
  delete(id: string): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/cars/${id}`, {
      method: 'DELETE',
    });
  },

  // ── Sync with Dubicars Munaly ─────────────────────────────────────
  sync(): Promise<{ data: SyncResult }> {
    return apiFetch<{ data: SyncResult }>('/cars/sync', {
      method: 'POST',
    });
  },
};
