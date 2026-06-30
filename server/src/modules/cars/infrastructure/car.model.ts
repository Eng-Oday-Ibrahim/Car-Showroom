import mongoose, { Schema, type Model } from 'mongoose';

// ── Raw document shape stored in MongoDB ─────────────────
export interface ICarDocument {
  source:               'local' | 'dubicars';
  dubicarsAdId:         number | null;
  publishToSite:        boolean;
  publishToDubicars:    boolean;
  status:               'active' | 'paused' | 'sold' | 'deleted';

  make:                 string;
  model:                string;
  year:                 number;
  trim:                 string | null;
  price:                number;
  kmDriven:             number;

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
  exportStatus:         string | null;
  steeringSide:         'left' | 'right';

  warranty:             boolean;
  warrantyMonths:       string | null;

  images:               string[];
  features:             string[];
  descriptionEn:        string | null;
  descriptionAr:        string | null;
  additionalInfoEn:     string | null;
  additionalInfoAr:     string | null;
  adReference:          string | null;

  dubicarssyncdAt:      Date | null;
  createdAt:            Date;
  updatedAt:            Date;
}

const carSchema = new Schema<ICarDocument>(
  {
    // ── Source & Publication ────────────────────────────
    source: {
      type:     String,
      enum:     ['local', 'dubicars'],
      required: true,
    },
    dubicarsAdId: {
      type:    Number,
      default: null,
      index:   true,   // جلب سريع عند Sync
    },
    publishToSite: {
      type:     Boolean,
      default:  true,
    },
    publishToDubicars: {
      type:    Boolean,
      default: false,
    },

    // ── Status ──────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['active', 'paused', 'sold', 'deleted'],
      default: 'active',
      index:   true,
    },

    // ── Core ────────────────────────────────────────────
    make:     { type: String, required: true },
    model:    { type: String, required: true },
    year:     { type: Number, required: true },
    trim:     { type: String, default: null },
    price:    { type: Number, required: true, min: 0 },
    kmDriven: { type: Number, default: 0,    min: 0 },

    // ── Specs ────────────────────────────────────────────
    color:          { type: String, default: null },
    interiorColor:  { type: String, default: null },
    bodyType:       { type: String, default: null },
    fuelType:       { type: String, default: null },
    transmission:   { type: String, default: null },
    cylinders:      { type: Number, default: null },
    driveType:      { type: String, default: null },
    engineSize:     { type: String, default: null },
    seats:          { type: Number, default: null },
    doors:          { type: Number, default: null },
    horsePower:     { type: Number, default: null },
    wheelSize:      { type: String, default: null },

    // ── Condition ────────────────────────────────────────
    mechanicalCondition: { type: String, default: null },
    bodyCondition:       { type: String, default: null },

    // ── Compliance ───────────────────────────────────────
    regionalSpecs: { type: String, default: null },
    exportStatus:  { type: String, default: null },
    steeringSide:  { type: String, enum: ['left', 'right'], default: 'left' },

    // ── Warranty ─────────────────────────────────────────
    warranty:       { type: Boolean, default: false },
    warrantyMonths: { type: String,  default: null  },

    // ── Media & Content ──────────────────────────────────
    images:           { type: [String], default: [] },
    features:         { type: [String], default: [] },
    descriptionEn:    { type: String, default: null },
    descriptionAr:    { type: String, default: null },
    additionalInfoEn: { type: String, default: null },
    additionalInfoAr: { type: String, default: null },
    adReference:      { type: String, default: null },

    // ── Sync ─────────────────────────────────────────────
    dubicarssyncdAt: { type: Date, default: null },
  },
  {
    timestamps: true,    // يضيف createdAt و updatedAt تلقائياً
    collection: 'cars',
  }
);

// ── Indexes ──────────────────────────────────────────────
// بحث سريع في الواجهة العامة
carSchema.index({ make: 1, model: 1 });
carSchema.index({ status: 1, publishToSite: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: -1 });

// منع تكرار نفس الإعلان من دبي كار
carSchema.index(
  { dubicarsAdId: 1 },
  { unique: true, sparse: true }   // sparse يتجاهل null
);

export const CarModel: Model<ICarDocument> = mongoose.model<ICarDocument>(
  'Car',
  carSchema
);