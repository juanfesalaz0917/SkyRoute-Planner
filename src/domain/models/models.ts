/**
 * Domain models used by the frontend.
 *
 * These interfaces mirror the DTOs exposed by the backend API.
 */

export interface Activity {
  nombre: string;
  tipo: "obligatoria" | "opcional";
  duracionMin: number;
  costoUSD: number;
}

export interface Job {
  nombre: string;
  tarifaHora: number;
  maxHoras: number;
}

export interface Airport {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  zonaHoraria: string;
  esHub: boolean;

  costoAlojamiento?: number;
  costoAlimentacion?: number;

  aerolineas?: string[];
  actividades?: Activity[];
  trabajos?: Job[];

  gradoEntrada?: number;
  gradoSalida?: number;
}

export interface Route {
  origen: string;
  destino: string;

  distanciaKm: number;

  aeronaves: string[];

  costoBase: number;

  estanciaMinima: number;

  bloqueada: boolean;

  subsidiada: boolean;
}

export interface Aircraft {
  nombre: string;
  costoKm: number;
  tiempoKm: number;
}