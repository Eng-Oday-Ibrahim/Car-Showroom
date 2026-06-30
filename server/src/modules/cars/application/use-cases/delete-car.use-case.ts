import type { CarRepository } from '../../infrastructure/car.repository.js';

export class DeleteCarUseCase {
  constructor(private readonly repo: CarRepository) {}

  async execute(id: string): Promise<void> {
    const car = await this.repo.findById(id);
    if (!car) throw new Error(`السيارة غير موجودة: ${id}`);

    // سيارات دبي كار لا تُحذف يدوياً — تتحدث عبر Sync
    if (car.isFromDubicars()) {
      throw new Error('سيارات دبي كار لا يمكن حذفها يدوياً، تتحدث تلقائياً عبر المزامنة');
    }

    await this.repo.delete(id);
  }
}