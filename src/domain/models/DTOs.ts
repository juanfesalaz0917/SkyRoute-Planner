import type { Activity, Job } from "./models";

export interface NetworkSummary {
  total_aeropuertos: number;
  total_rutas: number;
  total_hubs: number;
  total_secundarios: number;
  total_rutas_bloqueadas: number;
}

export interface AirportSummary {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  zonaHoraria: string;
  esHub: boolean;
}

export interface AirportDetail {
  id: string;
  nombre: string;
  ciudad: string;
  pais: string;
  zonaHoraria: string;

  esHub: boolean;

  costoAlojamiento: number;
  costoAlimentacion: number;

  aerolineas: string[];

  actividades: Activity[];

  trabajos: Job[];

  gradoSalida: number;
  gradoEntrada: number;
}

export interface RouteDto {
  origen: string;
  destino: string;

  distanciaKm: number;

  aeronaves: string[];

  costoBase: number;

  estanciaMinima: number;

  bloqueada: boolean;

  subsidiada: boolean;
}