'use client';

const AUTH_STORAGE_KEY = 'hg-auth';

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
