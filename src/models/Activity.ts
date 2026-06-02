/**
 * Represents an optional activity available at an airport node.
 *
 * Optional activities are offered to the traveler at each destination:
 * tours, museum visits, cultural activities, etc.
 *
 * Mandatory activities (accommodation and meals) are NOT modeled here;
 * their costs live directly on the Airport node and are handled by the
 * advanced planner service according to the elapsed time rules.
 */
export type ActivityType = "obligatoria" | "opcional";

export class Activity {
  static readonly TIPO_OBLIGATORIA: ActivityType = "obligatoria";
  static readonly TIPO_OPCIONAL: ActivityType = "opcional";

  readonly nombre: string;
  readonly tipo: ActivityType;
  /** Duration in minutes */
  readonly duracionMin: number;
  /** Cost in USD */
  readonly costoUsd: number;

  constructor(
    nombre: string,
    tipo: ActivityType,
    duracionMin: number,
    costoUsd: number
  ) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.duracionMin = duracionMin;
    this.costoUsd = costoUsd;
  }

  /** Returns true when this activity is mandatory. */
  get esObligatoria(): boolean {
    return this.tipo === Activity.TIPO_OBLIGATORIA;
  }

  toString(): string {
    return `Activity(nombre='${this.nombre}', tipo='${this.tipo}', duracion=${this.duracionMin} min, costo=$${this.costoUsd})`;
  }
}
