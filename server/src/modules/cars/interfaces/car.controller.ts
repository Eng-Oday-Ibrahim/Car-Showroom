import { Router, type Request, type Response, type NextFunction } from 'express';
import { CarService }        from '../application/car.service.js';
import { validate }          from '../../../shared/middleware/validate.middleware.js';
import {
  createCarSchema,
  updateCarSchema,
  changeStatusSchema,
  listCarsSchema,
} from './car.dto.js';

export function createCarRouter(carService: CarService): Router {
  const router = Router();

  const serializeList = <T extends { toObject(): unknown }>(result: {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }) => ({
    ...result,
    data: result.data.map(car => car.toObject()),
  });

  // ── Public routes (واجهة الموقع) ─────────────────────

  /**
   * GET /cars
   * قائمة السيارات للزوار — فقط النشطة
   */
  router.get('/', validate(listCarsSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto    = req.query as unknown as ReturnType<typeof listCarsSchema.parse>;
      const result = await carService.list(
        { ...dto, status: 'active' },
        { page: dto.page, perPage: dto.perPage }
      );
      res.json({ success: true, ...serializeList(result) });
    } catch (err) { next(err); }
  });

  /**
   * GET /cars/:id
   * تفاصيل سيارة واحدة
   */
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const car = await carService.findById(id);
      if (!car) return res.status(404).json({ success: false, message: 'السيارة غير موجودة' });
      res.json({ success: true, data: car.toObject() });
    } catch (err) { next(err); }
  });

  // ── Dashboard routes (لوحة التحكم) ───────────────────

  /**
   * GET /cars/dashboard/all
   * كل السيارات بكل حالاتها للوحة التحكم
   */
  router.get('/dashboard/all', validate(listCarsSchema, 'query'), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto    = req.query as unknown as ReturnType<typeof listCarsSchema.parse>;
      const result = await carService.list(
        { status: dto.status, source: dto.source, sort: dto.sort, make: dto.make, model: dto.model,
          minPrice: dto.minPrice, maxPrice: dto.maxPrice, minYear: dto.minYear, maxYear: dto.maxYear,
          minKm: dto.minKm, maxKm: dto.maxKm },
        { page: dto.page, perPage: dto.perPage }
      );
      res.json({ success: true, ...serializeList(result) });
    } catch (err) { next(err); }
  });

  /**
   * POST /cars
   * إضافة سيارة جديدة (محلية فقط)
   */
  router.post('/', validate(createCarSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const car = await carService.create(req.body);
      res.status(201).json({ success: true, data: car.toObject() });
    } catch (err) { next(err); }
  });

  /**
   * PUT /cars/:id
   * تعديل سيارة محلية
   */
  router.put('/:id', validate(updateCarSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const car = await carService.update(id, req.body);
      res.json({ success: true, data: car.toObject() });
    } catch (err) { next(err); }
  });

  /**
   * PATCH /cars/:id/status
   * تغيير حالة سيارة محلية (activate / pause / sold)
   */
  router.patch('/:id/status', validate(changeStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const car = await carService.setStatus(id, req.body.action);
      res.json({ success: true, data: car.toObject() });
    } catch (err) { next(err); }
  });

  /**
   * DELETE /cars/:id
   * حذف سيارة محلية
   */
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await carService.delete(id);
      res.json({ success: true, message: 'Car deleted successfully' });
    } catch (err) { next(err); }
  });

  /**
   * POST /cars/sync
   * تشغيل المزامنة يدوياً من لوحة التحكم
   */
  router.post('/sync', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await carService.sync();
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  });

  return router;
}
