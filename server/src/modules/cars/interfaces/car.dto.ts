import { z } from 'zod';

// ── Reusable field schemas ────────────────────────────────

const yearSchema = z.coerce.number({ message: 'year must be a number' }).int().min(1900, 'year must be 1900 or more').max(2100, 'year must be 2100 or less');

const priceSchema = z.coerce.number({ message: 'price must be a number' }).min(0, 'price cannot be negative');

const optionalString = z.string().nullable().optional();
const optionalInt    = z.number().int().nullable().optional();

// ── Create ────────────────────────────────────────────────

export const createCarSchema = z.object({
  make:     z.string().min(1, 'make is required'),
  model:    z.string().min(1, 'model is required'),
  year:     yearSchema,
  price:    priceSchema,
  kmDriven: z.number().int().min(0).optional().default(0),
  trim:     optionalString,

  color:               optionalString,
  interiorColor:       optionalString,
  bodyType:            optionalString,
  fuelType:            optionalString,
  transmission:        optionalString,
  cylinders:           optionalInt,
  driveType:           optionalString,
  engineSize:          optionalString,
  seats:               optionalInt,
  doors:               optionalInt,
  horsePower:          optionalInt,
  wheelSize:           optionalString,

  mechanicalCondition: optionalString,
  bodyCondition:       optionalString,

  regionalSpecs:  optionalString,
  exportStatus:   z.enum(['can_be_exported', 'not_for_export']).optional(),
  steeringSide:   z.enum(['left', 'right']).optional().default('left'),

  warranty:       z.boolean().optional().default(false),
  warrantyMonths: optionalString,

  images:           z.array(z.string().url('Invalid image URL')).optional().default([]),
  features:         z.array(z.string()).optional().default([]),
  descriptionEn:    optionalString,
  descriptionAr:    optionalString,
  additionalInfoEn: optionalString,
  additionalInfoAr: optionalString,
  adReference:      optionalString,
});

export type CreateCarDto = z.infer<typeof createCarSchema>;

// ── Update (كل الحقول اختيارية) ─────────────────────────

export const updateCarSchema = createCarSchema.partial();

export type UpdateCarDto = z.infer<typeof updateCarSchema>;

// ── Status change ─────────────────────────────────────────

export const changeStatusSchema = z.object({
  action: z.enum(['activate', 'pause', 'sold'], { message: 'action must be: activate, pause, or sold' }),
});

export type ChangeStatusDto = z.infer<typeof changeStatusSchema>;

// ── List / Filter ─────────────────────────────────────────

export const listCarsSchema = z.object({
  page:     z.coerce.number().int().min(1).optional().default(1),
  perPage:  z.coerce.number().int().min(1).max(1000).optional().default(20),
  status:   z.enum(['active', 'paused', 'sold', 'deleted']).optional(),
  source:   z.enum(['local', 'dubicars']).optional(),
  sort:     z.enum(['newest', 'price_asc', 'price_desc', 'year_desc']).optional().default('newest'),
  make:     z.string().optional(),
  model:    z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minYear:  z.coerce.number().int().optional(),
  maxYear:  z.coerce.number().int().optional(),
  minKm:    z.coerce.number().int().min(0).optional(),
  maxKm:    z.coerce.number().int().min(0).optional(),
});

export type ListCarsDto = z.infer<typeof listCarsSchema>;
