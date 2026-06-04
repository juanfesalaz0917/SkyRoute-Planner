export interface FlightLeg {
  origen: string;
  destino: string;

  aeronave: string;

  distancia_km: number;

  costo_usd: number;

  tiempo_min: number;
}

export interface RouteResult {
  camino: string[];

  tramos: FlightLeg[];

  distancia_total_km: number;

  costo_total_usd: number;

  tiempo_total_min: number;
}