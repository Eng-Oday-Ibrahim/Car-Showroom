import type { CarStatusValue } from './car-status';
import type { CarSourceValue } from './car-source';
import type { CarStatus }      from './car-status';
import type { CarSource }      from './car-source';

export interface CarProps {
  // Identity
  id?:           string | null;
  source:        CarSource | CarSourceValue;
  dubicarsAdId?: number | null;
  status?:       CarStatus | CarStatusValue;

  // Core
  make:      string;
  model:     string;
  year:      number;
  price:     number;
  kmDriven?: number;
  trim?:     string | null;

  // Specs
  color?:               string | null;
  interiorColor?:       string | null;
  bodyType?:            string | null;
  fuelType?:            string | null;
  transmission?:        string | null;
  cylinders?:           number | null;
  driveType?:           string | null;
  engineSize?:          string | null;
  seats?:               number | null;
  doors?:               number | null;
  horsePower?:          number | null;
  wheelSize?:           string | null;

  // Condition
  mechanicalCondition?: string | null;
  bodyCondition?:       string | null;

  // Compliance
  regionalSpecs?: string | null;
  exportStatus?:  string | null;
  steeringSide?:  'left' | 'right';

  // Warranty
  warranty?:       boolean;
  warrantyMonths?: string | null;

  // Media & Content
  images?:           string[];
  features?:         string[];
  descriptionEn?:    string | null;
  descriptionAr?:    string | null;
  additionalInfoEn?: string | null;
  additionalInfoAr?: string | null;
  adReference?:      string | null;

  // Timestamps
  createdAt?:      Date | string;
  updatedAt?:      Date | string;
  dubicarssyncdAt?: Date | string | null;
}

export type { CarStatusValue, CarSourceValue };
export type { CarStatus, CarSource };

