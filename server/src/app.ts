import express, { type Application } from 'express';
import cors                           from 'cors';
import { CarRepository }             from './modules/cars/infrastructure/car.repository';
import { DubicarsApiClient }         from './modules/cars/infrastructure/external/dubicars-api.client';
import { CarService }                from './modules/cars/application/car.service';
import { createCarRouter }           from './modules/cars/interfaces/car.controller';
import { UserRepository }            from './modules/identity/infrastructure/user.repository';
import { IdentityService }           from './modules/identity/application/identity.service';
import { createIdentityRouter }      from './modules/identity/interfaces/identity.controller';
import { errorHandler }              from './shared/errors/error-handler.middleware';
import { startSyncScheduler }        from './shared/scheduler/sync.scheduler';

export async function createApp(): Promise<Application> {
  const app = express();

  // ── Middleware ────────────────────────────────────────
  app.use(cors());
  app.use(express.json());

  // ── Dependency wiring ─────────────────────────────────
  // Client يأخذ الـ credentials مباشرة ويتولى الـ login تلقائياً
  const dubicarsClient = new DubicarsApiClient({
    email:    process.env['DUBICARS_EMAIL']    ?? '',
    password: process.env['DUBICARS_PASSWORD'] ?? '',
  });

  const carRepo    = new CarRepository();
  const carService = new CarService(carRepo, dubicarsClient);
  const identityRepo = new UserRepository();
  const identityService = new IdentityService(identityRepo);

  // ── Routes ────────────────────────────────────────────
  app.use('/api/auth', createIdentityRouter(identityService));
  app.use('/api/cars', createCarRouter(carService));

  // Health check
  app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

  // ── Scheduler ─────────────────────────────────────────
  startSyncScheduler(carService);

  // ── Error handler ─────────────────────────────────────
  app.use(errorHandler);

  return app;
}