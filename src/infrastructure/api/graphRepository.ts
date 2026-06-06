import { api } from "./api";
import type { AirportDetail, AirportSummary, NetworkSummary, RouteDto } from "../../domain/models/DTOs";

export const graphRepository = {
  /**
   * Obtiene la información completa de un aeropuerto
   */
  getAirportInfo: async (airportId: string): Promise<AirportDetail> => {
    const response = await api.get(`/graph/aeropuerto/${airportId}`);
    return response.data;
  },

  /**
   * Lista todos los aeropuertos, opcionalmente filtrados solo a hubs
   */
  listAirports: async (hubsOnly: boolean = false): Promise<AirportSummary[]> => {
    const response = await api.get("/graph/aeropuertos", {
      params: { hubs_only: hubsOnly },
    });
    return response.data;
  },

  /**
   * Lista todas las rutas disponibles
   */
  listRoutes: async (includeBlocked: boolean = false): Promise<RouteDto[]> => {
    const response = await api.get("/graph/rutas", {
      params: { include_blocked: includeBlocked },
    });
    return response.data;
  },

  /**
   * Obtiene todas las rutas salientes desde un aeropuerto específico
   */
  getRoutesFrom: async (
    airportId: string,
    includeBlocked: boolean = false
  ): Promise<RouteDto[]> => {
    const response = await api.get(`/graph/rutas-desde/${airportId}`, {
      params: { include_blocked: includeBlocked },
    });
    return response.data;
  },

  /**
   * Obtiene un resumen estadístico de la red aeroportuaria
   */
  getNetworkSummary: async (): Promise<NetworkSummary> => {
    const response = await api.get("/graph/resumen-red");
    return response.data;
  },

  /**
   * Verifica si un aeropuerto existe en la red
   */
  airportExists: async (airportId: string): Promise<boolean> => {
    const response = await api.get(`/graph/existe-aeropuerto/${airportId}`);
    return response.data.existe;
  },
};
