import type { Car }           from '../../domain/car.js';
import type { CarProps }      from '../../domain/car.types.js';
import type { CarRepository } from '../../infrastructure/car.repository.js';

export type UpdateCarInput = Partial<Omit<CarProps,
  'id' | 'source' | 'dubicarsAdId' | 'status' | 'createdAt' | 'updatedAt' | 'dubicarssyncdAt'
>>;

export class UpdateCarUseCase {
  constructor(private readonly repo: CarRepository) {}

  async execute(id: string, input: UpdateCarInput): Promise<Car> {
    const car = await this.repo.findById(id);
    if (!car) throw new Error(`السيارة غير موجودة: ${id}`);

    // سيارات دبي كار للقراءة فقط — تتحدث عبر Sync
    if (car.isFromDubicars()) {
      throw new Error('سيارات دبي كار لا يمكن تعديلها يدوياً، تتحدث تلقائياً عبر المزامنة');
    }

    const updated = car.update(input as Partial<CarProps>);
    return this.repo.save(updated);
  }
}