import type { Car }           from '../../domain/car.js';
import type { CarRepository } from '../../infrastructure/car.repository.js';

export type CarStatusAction = 'activate' | 'pause' | 'sold';

export class ChangeCarStatusUseCase {
  constructor(private readonly repo: CarRepository) {}

  async execute(id: string, action: CarStatusAction): Promise<Car> {
    const car = await this.repo.findById(id);
    if (!car) throw new Error(`السيارة غير موجودة: ${id}`);

    if (car.isFromDubicars()) {
      throw new Error('حالة سيارات دبي كار تتحدث تلقائياً عبر المزامنة');
    }

    const updated = this.#applyAction(car, action);
    return this.repo.save(updated);
  }

  #applyAction(car: Car, action: CarStatusAction): Car {
    switch (action) {
      case 'activate': return car.activate();
      case 'pause':    return car.pause();
      case 'sold':     return car.markAsSold();
      default:         throw new Error(`action غير معروف: ${action as string}`);
    }
  }
}