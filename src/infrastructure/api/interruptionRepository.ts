import { api } from "./api";
import type { RouteResult, TravelerState } from "./plannerRepository";

export interface BlockedRoute {
  origen: string;
  destino: string;
  distancia_km: number;
}

export interface RecalculationResult {
  recalculado: boolean;
  mensaje: string;
  origen_actual?: string;
  destino_final?: string;
  nuevo_itinerario?: RouteResult;
}

export const interruptionRepository = {
  /**
   * Bloquea una ruta entre dos aeropuertos
   */
  blockRoute: async (origen: string, destino: string): Promise<void> => {
    await api.post("/interruptions/bloquear-ruta", {
      origen,
      destino,
    });
  },

  /**
   * Desbloquea una ruta entre dos aeropuertos
   */
  unblockRoute: async (origen: string, destino: string): Promise<void> => {
    await api.post("/interruptions/desbloquear-ruta", {
      origen,
      destino,
    });
  },

  /**
   * Lista todas las rutas bloqueadas actualmente
   */
  listBlockedRoutes: async (): Promise<BlockedRoute[]> => {
    const response = await api.get("/interruptions/rutas-bloqueadas");
    return response.data.rutas_bloqueadas || [];
  },

  /**
   * Recalcula el itinerario después de una interrupción
   */
  recalculateItinerary: async (
    estado: TravelerState,
    destinoFinal: string,
    criterio: "costo" | "tiempo" | "distancia" = "distancia",
    incluirSecundarios: boolean = true,
    tiposTransporte?: string[]
  ): Promise<RecalculationResult> => {
    const response = await api.post("/interruptions/recalcular-itinerario", {
      estado_viajero: estado,
      destino_final: destinoFinal,
      criterio,
      incluir_secundarios: incluirSecundarios,
      tipos_transporte: tiposTransporte,
    });
    return response.data;
  },

  /**
   * Obtiene información sobre interrupciones disponibles
   */
  getInterruptionInfo: async (): Promise<{
    rutas_bloqueadas_total: number;
    aeropuertos_afectados: string[];
  }> => {
    const response = await api.get("/interruptions/info");
    return response.data;
  },
};
