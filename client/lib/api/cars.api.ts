import type {
  Car,
  CarFilters,
  CarStatusAction,
  CreateCarInput,
  PaginatedCars,
  SyncResult,
  UpdateCarInput,
} from '../../types/car.types';

const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:5000/api';

// ── Base fetch wrapper ────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const json = await res.json() as { success: boolean; message?: string } & T;

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `API error ${res.status}`);
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