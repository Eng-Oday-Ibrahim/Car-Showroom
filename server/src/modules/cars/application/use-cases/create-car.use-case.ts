import { Car }               from '../../domain/car.js';
import { CarSource }         from '../../domain/car-source.js';
import type { CarProps }     from '../../domain/car.types.js';
import type { CarRepository } from '../../infrastructure/car.repository.js';

export type CreateCarInput = Omit<CarProps,
  'id' | 'source' | 'dubicarsAdId' | 'status' | 'createdAt' | 'updatedAt' | 'dubicarssyncdAt'
>;

export class CreateCarUseCase {
  constructor(private readonly repo: CarRepository) {}

  async execute(input: CreateCarInput): Promise<Car> {
    const car = new Car({
      ...input,
      source: CarSource.local(),
      status: 'active',
    } as CarProps);

    return this.repo.save(car);
  }
}