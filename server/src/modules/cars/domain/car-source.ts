export const VALID_SOURCES = {
  LOCAL:    'local',
  DUBICARS: 'dubicars',
} as const;

export type CarSourceValue = (typeof VALID_SOURCES)[keyof typeof VALID_SOURCES];

export class CarSource {
  readonly #source: CarSourceValue;
  readonly #dubicarsAdId: number | null;

  constructor(source: string, dubicarsAdId: number | null = null) {
    const normalized = source?.toLowerCase();
    const validValues = Object.values(VALID_SOURCES) as string[];

    if (!validValues.includes(normalized)) {
      throw new Error(
        `CarSource غير صالح: "${source}". القيم المقبولة: ${validValues.join(', ')}`
      );
    }

    if (normalized === VALID_SOURCES.DUBICARS && !dubicarsAdId) {
      throw new Error('dubicarsAdId مطلوب عندما يكون المصدر dubicars');
    }

    this.#source      = normalized as CarSourceValue;
    this.#dubicarsAdId = dubicarsAdId ?? null;
  }

  get value():        CarSourceValue  { return this.#source;       }
  get dubicarsAdId(): number | null   { return this.#dubicarsAdId; }

  isLocal():    boolean { return this.#source === VALID_SOURCES.LOCAL;    }
  isDubicars(): boolean { return this.#source === VALID_SOURCES.DUBICARS; }

  linkToDubicars(adId: number): CarSource {
    if (!adId) throw new Error('adId مطلوب للربط بدبي كار');
    return new CarSource(this.#source, adId);
  }

  equals(other: CarSource): boolean {
    return other.value === this.#source && other.dubicarsAdId === this.#dubicarsAdId;
  }

  toString(): string {
    return this.#dubicarsAdId
      ? `${this.#source}(${this.#dubicarsAdId})`
      : this.#source;
  }

  // Factory methods
  static local():                            CarSource { return new CarSource(VALID_SOURCES.LOCAL);                   }
  static dubicars(id: number):               CarSource { return new CarSource(VALID_SOURCES.DUBICARS, id);            }
  static from(s: string, id?: number | null): CarSource { return new CarSource(s, id ?? null);                        }
}