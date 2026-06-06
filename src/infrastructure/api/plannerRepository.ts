import { api } from "./api";

export interface RouteResult {
  origen: string;
  destino: string;
  distancia_km: number;
  tiempo_total_min: number;
  costo_total: number;
  ruta_aeropuertos: string[];
  detalle_vuelos: Array<{
    origen: string;
    destino: string;
    aeronave: string;
    distancia_km: number;
    tiempo_min: number;
    costo: number;
  }>;
}

export interface ItineraryAlternative {
  alternativa: string;
  criterio: string;
  destinos_visitados: number;
  tiempo_requerido_min: number;
  costo_total: number;
  ruta: RouteResult;
}

export interface TravelerState {
  aeropuerto_actual: string;
  presupuesto_inicial: number;
  presupuesto_actual: number;
  tiempo_total_min: number;
  tiempo_restante_min: number;
  minutos_desde_comida: number;
  minutos_desde_alojamiento: number;
  destinos_visitados: string[];
  vuelos: Array<{
    origen: string;
    destino: string;
    aeronave: string;
    costo: number;
    tiempo_min: number;
  }>;
  actividades: Array<{
    id: string;
    nombre: string;
    duracion_min: number;
    costo: number;
  }>;
  trabajos: Array<{
    id: string;
    descripcion: string;
    duracion_min: number;
    pago: number;
  }>;
  gasto_total: number;
  ganancia_total: number;
}

export interface StepAdvanceResult {
  estado_actualizado: TravelerState;
  vuelo: {
    origen: string;
    destino: string;
    aeronave: string;
    costo: number;
    tiempo_min: number;
  };
  mensaje: string;
}

export const plannerRepository = {
  // BASIC PLANNER METHODS

  /**
   * Calcula la ruta óptima entre dos aeropuertos según un criterio
   */
  calculateOptimalRoute: async (
    origen: string,
    destino: string,
    criterio: "costo" | "tiempo" | "distancia",
    incluirSecundarios: boolean = true,
    tiposTransporte?: string[]
  ): Promise<RouteResult | null> => {
    const response = await api.post("/planner/ruta-optima", {
      origen,
      destino,
      criterio,
      incluir_secundarios: incluirSecundarios,
      tipos_transporte: tiposTransporte,
    });
    return response.data.ruta || null;
  },

  /**
   * Propone dos alternativas de itinerario
   */
  proposeItineraries: async (
    origen: string,
    presupuesto: number,
    tiempoDisponibleHoras: number,
    incluirSecundarios: boolean = true,
    tiposTransporte?: string[]
  ): Promise<ItineraryAlternative[]> => {
    const response = await api.post("/planner/proponer-itinerarios", {
      origen,
      presupuesto,
      tiempo_disponible_horas: tiempoDisponibleHoras,
      incluir_secundarios: incluirSecundarios,
      tipos_transporte: tiposTransporte,
    });
    return response.data.alternativas || [];
  },

  // ADVANCED PLANNER METHODS

  /**
   * Inicia un nuevo viaje con estado inicial
   */
  initializeTrip: async (
    origen: string,
    presupuesto: number,
    tiempoTotalHoras: number = 120
  ): Promise<TravelerState> => {
    const response = await api.post("/planner/iniciar-viaje", {
      origen,
      presupuesto_inicial: presupuesto,
      tiempo_total_horas: tiempoTotalHoras,
    });
    return response.data;
  },

  /**
   * Avanza un paso en el viaje (realizar un vuelo)
   */
  advanceStep: async (
    estado: TravelerState,
    destino: string,
    aeronave: string
  ): Promise<StepAdvanceResult> => {
    const response = await api.post("/planner/avanzar-paso", {
      estado,
      destino,
      aeronave,
    });
    return response.data;
  },

  /**
   * Obtiene una recomendación para el siguiente paso
   */
  getStepRecommendation: async (
    estado: TravelerState,
    criterio: "costo" | "tiempo" | "destinos"
  ): Promise<{
    aeropuerto_recomendado: string;
    razon: string;
    beneficios: string[];
  }> => {
    const response = await api.post("/planner/recomendacion-paso", {
      estado,
      criterio,
    });
    return response.data;
  },
};
