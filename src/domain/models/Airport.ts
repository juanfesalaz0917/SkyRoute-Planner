import { Activity } from "./Activity";
import { Job } from "./Job";

/**
 * Represents an airport node in the flight network graph.
 *
 * Each airport is uniquely identified by its IATA code (e.g. 'BOG', 'LIM').
 * Hub airports differ from secondary ones visually in the UI and may be
 * excluded from route calculations when the traveler opts to skip secondary
 * airports.
 */
export class Airport {
  /** IATA code (3 letters, uppercase) */
  readonly id: string;
  readonly nombre: string;
  readonly ciudad: string;
  readonly pais: string;
  /** Timezone string (e.g. 'America/Bogota') */
  readonly zonaHoraria: string;
  /** True when the airport is a major hub */
  readonly esHub: boolean;
  /** Accommodation cost per night in USD */
  readonly costoAlojamiento: number;
  /** Meal cost per sitting in USD */
  readonly costoAlimentacion: number;
  readonly actividades: Activity[];
  readonly trabajos: Job[];
  readonly aerolineas: string[];

  constructor(
    id: string,
    nombre: string,
    ciudad: string,
    pais: string,
    zonaHoraria: string,
    esHub: boolean,
    costoAlojamiento: number,
    costoAlimentacion: number,
    actividades: Activity[] = [],
    trabajos: Job[] = [],
    aerolineas: string[] = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.ciudad = ciudad;
    this.pais = pais;
    this.zonaHoraria = zonaHoraria;
    this.esHub = esHub;
    this.costoAlojamiento = costoAlojamiento;
    this.costoAlimentacion = costoAlimentacion;
    this.actividades = actividades;
    this.trabajos = trabajos;
    this.aerolineas = aerolineas;
  }

  toString(): string {
    const hubLabel = this.esHub ? " [HUB]" : "";
    return `Airport(${this.id}${hubLabel}, ${this.ciudad}, ${this.pais})`;
  }
}
