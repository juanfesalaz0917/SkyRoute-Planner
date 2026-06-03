/**
 * Represents a temporary job available at an airport.
 *
 * The traveler may accept a job when their current budget falls below
 * 35 % of the initial budget (threshold configurable in the JSON).
 *
 * Income formula: tarifaHora * min(horasSolicitadas, maxHoras)
 */
export class Job {
  readonly nombre: string;
  /** Hourly pay rate in USD */
  readonly tarifaHora: number;
  /** Maximum hours the traveler can work in this job */
  readonly maxHoras: number;

  constructor(nombre: string, tarifaHora: number, maxHoras: number) {
    this.nombre = nombre;
    this.tarifaHora = tarifaHora;
    this.maxHoras = maxHoras;
  }

  /**
   * Calculate income for the given hours, capped by maxHoras.
   * @param horas - Hours the traveler wants to work.
   * @returns Total income in USD, rounded to 2 decimal places.
   */
  calcularIngreso(horas: number): number {
    const horasEfectivas = Math.min(horas, this.maxHoras);
    return Math.round(horasEfectivas * this.tarifaHora * 100) / 100;
  }

  toString(): string {
    return `Job(nombre='${this.nombre}', tarifa=$${this.tarifaHora}/h, max=${this.maxHoras}h)`;
  }
}
