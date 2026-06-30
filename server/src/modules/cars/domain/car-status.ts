export const VALID_STATUSES = {
  ACTIVE:  'active',
  PAUSED:  'paused',
  SOLD:    'sold',
  DELETED: 'deleted',
} as const;

export type CarStatusValue = (typeof VALID_STATUSES)[keyof typeof VALID_STATUSES];

export class CarStatus {
  readonly #value: CarStatusValue;

  constructor(status: string) {
    const normalized = status?.toLowerCase();
    const validValues = Object.values(VALID_STATUSES) as string[];

    if (!validValues.includes(normalized)) {
      throw new Error(
        `CarStatus غير صالح: "${status}". القيم المقبولة: ${validValues.join(', ')}`
      );
    }

    this.#value = normalized as CarStatusValue;
  }

  get value(): CarStatusValue {
    return this.#value;
  }

  equals(other: CarStatus): boolean {
    return other.value === this.#value;
  }

  isActive():  boolean { return this.#value === VALID_STATUSES.ACTIVE;  }
  isPaused():  boolean { return this.#value === VALID_STATUSES.PAUSED;  }
  isSold():    boolean { return this.#value === VALID_STATUSES.SOLD;    }
  isDeleted(): boolean { return this.#value === VALID_STATUSES.DELETED; }

  toString(): string {
    return this.#value;
  }

  // Factory methods
  static active():         CarStatus { return new CarStatus(VALID_STATUSES.ACTIVE);  }
  static paused():         CarStatus { return new CarStatus(VALID_STATUSES.PAUSED);  }
  static sold():           CarStatus { return new CarStatus(VALID_STATUSES.SOLD);    }
  static deleted():        CarStatus { return new CarStatus(VALID_STATUSES.DELETED); }
  static from(v: string):  CarStatus { return new CarStatus(v);                      }
}