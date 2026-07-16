'use client';

const AUTH_STORAGE_KEY = 'hg-auth';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

export function getStoredAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function saveAuth(state: AuthState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAdmin(user: AuthUser | null | undefined) {
  return user?.role === 'admin';
}

export async function getSavedCarIds(userId?: string): Promise<string[]> {
  if (typeof window === 'undefined' || !userId) return [];

  const auth = getStoredAuth();
  if (!auth.token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me/favorites`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: { favoriteCarIds?: string[] } };
    return payload.data?.favoriteCarIds ?? [];
  } catch {
    return [];
  }
}

export async function toggleSavedCar(carId: string) {
  if (typeof window === 'undefined') {
    return { isSaved: false, savedCarIds: [] as string[] };
  }

  const auth = getStoredAuth();
  if (!auth.token) {
    return { isSaved: false, savedCarIds: [] as string[] };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/favorites/${carId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      return { isSaved: false, savedCarIds: [] as string[] };
    }

    const payload = (await response.json()) as { data?: { favoriteCarIds?: string[]; isFavorite?: boolean } };
    return {
      isSaved: payload.data?.isFavorite ?? false,
      savedCarIds: payload.data?.favoriteCarIds ?? [],
    };
  } catch {
    return { isSaved: false, savedCarIds: [] as string[] };
  }
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    token?: string;
    user?: AuthUser;
    message?: string;
  };

  if (!response.ok || !payload.success || !payload.token || !payload.user) {
    throw new Error(payload.message ?? 'Registration failed');
  }

  return payload;
}

export async function loginUser(input: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as {
    success?: boolean;
    token?: string;
    user?: AuthUser;
    message?: string;
  };

  if (!response.ok || !payload.success || !payload.token || !payload.user) {
    throw new Error(payload.message ?? 'Login failed');
  }

  return payload;
}

export async function getCurrentUser() {
  const auth = getStoredAuth();
  if (!auth.token) return null;

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as { data?: AuthUser };
  return payload.data ?? null;
}

/**
 * Request a password reset email for the given email address.
 * Always resolves (never throws) — the server doesn't reveal if the email exists.
 */
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'Request failed');
  }
}

/**
 * Reset the password using a token from the reset email.
 */
export async function resetPassword(token: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  const payload = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? 'Reset failed');
  }
}
