import { CarRepository }           from '../infrastructure/car.repository';
import { DubicarsApiClient }       from '../infrastructure/external/dubicars-api.client';
import { CreateCarUseCase }        from './use-cases/create-car.use-case';
import { UpdateCarUseCase }        from './use-cases/update-car.use-case';
import { DeleteCarUseCase }        from './use-cases/delete-car.use-case';
import { ChangeCarStatusUseCase }  from './use-cases/change-car-status.use-case';
import { SyncFromDubicarsUseCase } from './use-cases/sync-dubicars.use-case';

export type { CreateCarInput }   from './use-cases/create-car.use-case';
export type { UpdateCarInput }   from './use-cases/update-car.use-case';
export type { CarStatusAction }  from './use-cases/change-car-status.use-case';
export type { SyncResult }       from './use-cases/sync-dubicars.use-case';

export class CarService {
  private readonly createCar:       CreateCarUseCase;
  private readonly updateCar:       UpdateCarUseCase;
  private readonly deleteCar:       DeleteCarUseCase;
  private readonly changeCarStatus: ChangeCarStatusUseCase;
  private readonly syncFromDubicars: SyncFromDubicarsUseCase;

  constructor(
    private readonly repo:           CarRepository,
    private readonly dubicarsClient: DubicarsApiClient,
  ) {
    this.createCar        = new CreateCarUseCase(repo);
    this.updateCar        = new UpdateCarUseCase(repo);
    this.deleteCar        = new DeleteCarUseCase(repo);
    this.changeCarStatus  = new ChangeCarStatusUseCase(repo);
    this.syncFromDubicars = new SyncFromDubicarsUseCase(repo, dubicarsClient);
  }

  // ── Delegators ────────────────────────────────────────

  create:      CarService['createCar']['execute']       = (...args) => this.createCar.execute(...args);
  update:      CarService['updateCar']['execute']       = (...args) => this.updateCar.execute(...args);
  delete:      CarService['deleteCar']['execute']       = (...args) => this.deleteCar.execute(...args);
  setStatus:   CarService['changeCarStatus']['execute'] = (...args) => this.changeCarStatus.execute(...args);
  sync:        CarService['syncFromDubicars']['execute'] = (...args) => this.syncFromDubicars.execute(...args);

  // ── Read (direct from repo) ─────────────────────────

  findById = (id: string)                                                       => this.repo.findById(id);
  list     = (filters = {}, pagination = { page: 1, perPage: 20 })             => this.repo.list(filters, pagination);
}