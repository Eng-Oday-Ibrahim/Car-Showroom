import { SettingRepository } from '../infrastructure/setting.repository';

const DUBICARS_EMAIL_KEY    = 'dubicars.email';
const DUBICARS_PASSWORD_KEY = 'dubicars.password';

export class SettingsService {
  constructor(private readonly settingRepo: SettingRepository) {}

  /**
   * Get DubiCars credentials.
   * Falls back to env vars if not set in DB.
   */
  async getDubicarsCredentials(): Promise<{ email: string; password: string }> {
    const [email, password] = await Promise.all([
      this.settingRepo.get(DUBICARS_EMAIL_KEY),
      this.settingRepo.get(DUBICARS_PASSWORD_KEY),
    ]);

    return {
      email:    email    ?? process.env['DUBICARS_EMAIL']    ?? '',
      password: password ?? process.env['DUBICARS_PASSWORD'] ?? '',
    };
  }

  /**
   * Update DubiCars credentials in DB.
   */
  async updateDubicarsCredentials(email: string, password: string): Promise<void> {
    await Promise.all([
      this.settingRepo.set(DUBICARS_EMAIL_KEY, email),
      this.settingRepo.set(DUBICARS_PASSWORD_KEY, password),
    ]);
  }
}
