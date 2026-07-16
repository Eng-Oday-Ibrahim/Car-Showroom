import { getStoredAuth } from '../auth/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function getAuthHeaders(): Record<string, string> {
  const auth = getStoredAuth();
  return auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
}

export interface DubicarsCredentials {
  email: string;
  password: string;
}

export const settingsApi = {
  /**
   * Get the current DubiCars credentials (password is masked).
   */
  async getDubicarsCredentials(): Promise<DubicarsCredentials> {
    const res = await fetch(`${API_BASE_URL}/settings/dubicars`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const json = (await res.json()) as {
      success: boolean;
      data?: DubicarsCredentials;
      message?: string;
    };
    if (!res.ok || !json.success) {
      throw new Error(json.message ?? `API error ${res.status}`);
    }
    return json.data!;
  },

  /**
   * Update the DubiCars credentials.
   */
  async updateDubicarsCredentials(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/settings/dubicars`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (!res.ok || !json.success) {
      throw new Error(json.message ?? `API error ${res.status}`);
    }
  },
};
