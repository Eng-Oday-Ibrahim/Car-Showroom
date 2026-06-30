import cron from 'node-cron';
import type { CarService } from '../../modules/cars/application/car.service';

export function startSyncScheduler(carService: CarService): void {
  // كل ساعة عند الدقيقة 0
  cron.schedule('0 * * * *', async () => {
    console.log(`[Sync] Beginning sync with Dubicars — ${new Date().toISOString()}`);

    try {
      const result = await carService.sync();

      console.log(
        `[Sync] ✅ Finished syncing with Dubicars — ` +
        `added: ${result.added} | ` +
        `updated: ${result.updated} | ` +
        `deleted: ${result.deleted}`
      );

      if (result.errors.length > 0) {
        console.warn(`[Sync] ⚠️  Errors (${result.errors.length}):`, result.errors);
      }
    } catch (err) {
      console.error('[Sync] ❌ Failed to sync:', err);
    }
  });

  console.log('🕐 Sync scheduler started — works every hour');
}