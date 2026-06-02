/**
 * Default rates for every aircraft type as specified in the project requirements.
 * These values can be overridden per-route via the JSON config section.
 */
export interface AircraftRates {
  costoKm: number;
  tiempoKm: number;
}

export const DEFAULT_AIRCRAFT: Record<string, AircraftRates> = {
  "Avión Comercial": { costoKm: 0.18, tiempoKm: 0.7 },
  "Avión Regional":  { costoKm: 0.25, tiempoKm: 1.1 },
  "Hélice":          { costoKm: 0.12, tiempoKm: 2.5 },
};

/**
 * Represents an aircraft type with its cost and flight-time rates per km.
 *
 * Cost formula  : distanciaKm * costoKm  → USD
 * Time formula  : distanciaKm * tiempoKm → minutes
 *
 * Default values (from project spec):
 *   Avión Comercial : $0.18/km, 0.7 min/km
 *   Avión Regional  : $0.25/km, 1.1 min/km
 *   Hélice          : $0.12/km, 2.5 min/km
 */
export class Aircraft {
  readonly nombre: string;
  /** Cost per km in USD */
  readonly costoKm: number;
  /** Flight time per km in minutes */
  readonly tiempoKm: number;

  constructor(nombre: string, costoKm: number, tiempoKm: number) {
    this.nombre = nombre;
    this.costoKm = costoKm;
    this.tiempoKm = tiempoKm;
  }

  /**
   * Calculate total flight cost in USD for a given distance.
   */
  calcularCosto(distanciaKm: number): number {
    return Math.round(distanciaKm * this.costoKm * 100) / 100;
  }

  /**
   * Calculate total flight time in minutes for a given distance.
   */
  calcularTiempo(distanciaKm: number): number {
    return Math.round(distanciaKm * this.tiempoKm * 100) / 100;
  }

  /**
   * Build an Aircraft instance using the built-in default rates.
   * @param nombre - Aircraft type name. Must be a key in DEFAULT_AIRCRAFT.
   * @throws Error if the aircraft type is not recognised.
   */
  static fromDefaults(nombre: string): Aircraft {
    const rates = DEFAULT_AIRCRAFT[nombre];
    if (!rates) {
      throw new Error(
        `Unknown aircraft type '${nombre}'. Valid types: ${Object.keys(DEFAULT_AIRCRAFT).join(", ")}`
      );
    }
    return new Aircraft(nombre, rates.costoKm, rates.tiempoKm);
  }

  toString(): string {
    return `Aircraft(nombre='${this.nombre}', costoKm=${this.costoKm}, tiempoKm=${this.tiempoKm})`;
  }
}
