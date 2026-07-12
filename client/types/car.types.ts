export type CarStatus = 'active' | 'paused' | 'sold' | 'deleted';
export type CarSource = 'local' | 'dubicars';
export type SteeringSide = 'left' | 'right';
export type ExportStatus = 'can_be_exported' | 'not_for_export';

export interface Car {
  id:                   string;
  source:               CarSource;
  dubicarsAdId:         number | null;
  status:               CarStatus;
  make:                 string;
  model:                string;
  year:                 number;
  price:                number;
  kmDriven:             number;
  trim:                 string | null;
  color:                string | null;
  interiorColor:        string | null;
  bodyType:             string | null;
  fuelType:             string | null;
  transmission:         string | null;
  cylinders:            number | null;
  driveType:            string | null;
  engineSize:           string | null;
  seats:                number | null;
  doors:                number | null;
  horsePower:           number | null;
  wheelSize:            string | null;
  mechanicalCondition:  string | null;
  bodyCondition:        string | null;
  regionalSpecs:        string | null;
  exportStatus:         ExportStatus | null;
  steeringSide:         SteeringSide;
  warranty:             boolean;
  warrantyMonths:       string | null;
  images:               string[];
  features:             string[];
  descriptionEn:        string | null;
  descriptionAr:        string | null;
  additionalInfoEn:     string | null;
  additionalInfoAr:     string | null;
  adReference:          string | null;
  createdAt:            string;
  updatedAt:            string;
  dubicarssyncdAt:      string | null;
}

export type CreateCarInput = Omit<Car,
  'id' | 'source' | 'dubicarsAdId' | 'status' | 'createdAt' | 'updatedAt' | 'dubicarssyncdAt'
>;

export type UpdateCarInput = Partial<CreateCarInput>;

export type CarStatusAction = 'activate' | 'pause' | 'sold';

export interface CarFilters {
  status?:   CarStatus;
  source?:   CarSource;
  sort?:     'newest' | 'price_asc' | 'price_desc' | 'year_desc';
  make?:     string;
  model?:    string;
  minPrice?: number;
  maxPrice?: number;
  minYear?:  number;
  maxYear?:  number;
  minKm?:    number;
  maxKm?:    number;
  page?:     number;
  perPage?:  number;
}

export interface PaginatedCars {
  data:       Car[];
  total:      number;
  page:       number;
  perPage:    number;
  totalPages: number;
}

export interface SyncResult {
  added:   number;
  updated: number;
  deleted: number;
  errors:  Array<{ dubicarsAdId: number; error: string }>;
}
