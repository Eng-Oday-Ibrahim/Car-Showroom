import { Car }                          from '../domain/car';
import { CarSource }                    from '../domain/car-source';
import { CarModel, type ICarDocument }  from './car.model';
import type { CarProps }                from '../domain/car.types';

// ── Filters accepted by list() ───────────────────────────
export interface CarFilters {
  status?:      string;
  source?:      string;
  make?:        string;
  model?:       string;
  minPrice?:    number;
  maxPrice?:    number;
  minYear?:     number;
  maxYear?:     number;
}

export interface PaginationOptions {
  page:    number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data:       T[];
  total:      number;
  page:       number;
  perPage:    number;
  totalPages: number;
}

// ── Repository ───────────────────────────────────────────
export class CarRepository {

  // ── Write ─────────────────────────────────────────────

  async save(car: Car): Promise<Car> {
    const data = this.#toDocument(car);

    if (car.id) {
      // تحديث موجود
      const updated = await CarModel.findByIdAndUpdate(
        car.id,
        { $set: data },
        { new: true, runValidators: true }
      );
      if (!updated) throw new Error(`Car not found: ${car.id}`);
      return this.#toDomain(updated);
    }

    // إنشاء جديد
    const created = await CarModel.create(data);
    return this.#toDomain(created);
  }

  async delete(id: string): Promise<void> {
    await CarModel.findByIdAndDelete(id);
  }

  // ── Read ──────────────────────────────────────────────

  async findById(id: string): Promise<Car | null> {
    const doc = await CarModel.findById(id);
    return doc ? this.#toDomain(doc) : null;
  }

  async findByDubicarsAdId(dubicarsAdId: number): Promise<Car | null> {
    const doc = await CarModel.findOne({ dubicarsAdId });
    return doc ? this.#toDomain(doc) : null;
  }

  async list(
    filters: CarFilters = {},
    pagination: PaginationOptions = { page: 1, perPage: 20 }
  ): Promise<PaginatedResult<Car>> {
    const query = this.#buildQuery(filters);
    const skip  = (pagination.page - 1) * pagination.perPage;

    const [docs, total] = await Promise.all([
      CarModel.find(query).skip(skip).limit(pagination.perPage).sort({ createdAt: -1 }),
      CarModel.countDocuments(query),
    ]);

    return {
      data:       docs.map(d => this.#toDomain(d)),
      total,
      page:       pagination.page,
      perPage:    pagination.perPage,
      totalPages: Math.ceil(total / pagination.perPage),
    };
  }

  /** يُستخدم في Sync — يجلب كل dubicarsAdIds الموجودة في DB */
  async findAllDubicarsAdIds(): Promise<number[]> {
    const docs = await CarModel.find(
      { dubicarsAdId: { $ne: null } },
      { dubicarsAdId: 1 }
    );
    return docs.map(d => d.dubicarsAdId as number);
  }

  /** يُستخدم في Sync — يعلّم السيارات المحذوفة من دبي كار */
  async markDeletedIfAdIdNotIn(activeIds: number[]): Promise<number> {
    const result = await CarModel.updateMany(
      {
        dubicarsAdId: { $nin: activeIds },
        source:       'dubicars',
        status:       { $ne: 'deleted' },
      },
      { $set: { status: 'deleted' } }
    );
    return result.modifiedCount;
  }

  // ── Mapping: Domain → Document ────────────────────────

  #toDocument(car: Car): Partial<ICarDocument> {
    return {
      source:              car.source.value,
      dubicarsAdId:        car.dubicarsAdId,
      status:              car.status.value,
      make:                car.make,
      model:               car.model,
      year:                car.year,
      trim:                car.trim,
      price:               car.price,
      kmDriven:            car.kmDriven,
      color:               car.color,
      interiorColor:       car.interiorColor,
      bodyType:            car.bodyType,
      fuelType:            car.fuelType,
      transmission:        car.transmission,
      cylinders:           car.cylinders,
      driveType:           car.driveType,
      engineSize:          car.engineSize,
      seats:               car.seats,
      doors:               car.doors,
      horsePower:          car.horsePower,
      wheelSize:           car.wheelSize,
      mechanicalCondition: car.mechanicalCondition,
      bodyCondition:       car.bodyCondition,
      regionalSpecs:       car.regionalSpecs,
      exportStatus:        car.exportStatus,
      steeringSide:        car.steeringSide,
      warranty:            car.warranty,
      warrantyMonths:      car.warrantyMonths,
      images:              car.images,
      features:            car.features,
      descriptionEn:       car.descriptionEn,
      descriptionAr:       car.descriptionAr,
      additionalInfoEn:    car.additionalInfoEn,
      additionalInfoAr:    car.additionalInfoAr,
      adReference:         car.adReference,
      dubicarssyncdAt:     car.dubicarssyncdAt,
    };
  }

  // ── Mapping: Document → Domain ────────────────────────

  #toDomain(doc: ICarDocument & { _id?: { toString(): string } }): Car {
    const props: CarProps = {
      id:           (doc._id as { toString(): string }).toString(),
      source:       CarSource.from(doc.source, doc.dubicarsAdId),
      status:               doc.status,
      make:                 doc.make,
      model:                doc.model,
      year:                 doc.year,
      trim:                 doc.trim,
      price:                doc.price,
      kmDriven:             doc.kmDriven,
      color:                doc.color,
      interiorColor:        doc.interiorColor,
      bodyType:             doc.bodyType,
      fuelType:             doc.fuelType,
      transmission:         doc.transmission,
      cylinders:            doc.cylinders,
      driveType:            doc.driveType,
      engineSize:           doc.engineSize,
      seats:                doc.seats,
      doors:                doc.doors,
      horsePower:           doc.horsePower,
      wheelSize:            doc.wheelSize,
      mechanicalCondition:  doc.mechanicalCondition,
      bodyCondition:        doc.bodyCondition,
      regionalSpecs:        doc.regionalSpecs,
      exportStatus:         doc.exportStatus,
      steeringSide:         doc.steeringSide,
      warranty:             doc.warranty,
      warrantyMonths:       doc.warrantyMonths,
      images:               doc.images,
      features:             doc.features,
      descriptionEn:        doc.descriptionEn,
      descriptionAr:        doc.descriptionAr,
      additionalInfoEn:     doc.additionalInfoEn,
      additionalInfoAr:     doc.additionalInfoAr,
      adReference:          doc.adReference,
      dubicarssyncdAt:      doc.dubicarssyncdAt,
      createdAt:            doc.createdAt,
      updatedAt:            doc.updatedAt,
    };
    return new Car(props);
  }

  // ── Query Builder ─────────────────────────────────────

  #buildQuery(filters: CarFilters): Record<string, unknown> {
    const query: Record<string, unknown> = {};

    if (filters.status)   query['status'] = filters.status;
    if (filters.source)   query['source'] = filters.source;
    if (filters.make)     query['make']   = new RegExp(filters.make, 'i');
    if (filters.model)    query['model']  = new RegExp(filters.model, 'i');

    if (filters.minPrice != null || filters.maxPrice != null) {
      query['price'] = {
        ...(filters.minPrice != null ? { $gte: filters.minPrice } : {}),
        ...(filters.maxPrice != null ? { $lte: filters.maxPrice } : {}),
      };
    }

    if (filters.minYear != null || filters.maxYear != null) {
      query['year'] = {
        ...(filters.minYear != null ? { $gte: filters.minYear } : {}),
        ...(filters.maxYear != null ? { $lte: filters.maxYear } : {}),
      };
    }

    return query;
  }
}