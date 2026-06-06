import type { AirportDetail, AirportSummary, NetworkSummary, RouteDto } from "../../domain/models/DTOs";
import { graphRepository } from "../../infrastructure/api/graphRepository";


class GraphService {
  /**
   * Obtiene información completa de un aeropuerto
   */
  async getAirportDetails(airportId: string): Promise<AirportDetail> {
    try {
      const airport = await graphRepository.getAirportInfo(airportId);
      return airport;
    } catch (error) {
      console.error(`Error fetching airport details for ${airportId}:`, error);
      throw error;
    }
  }

  /**
   * Lista todos los aeropuertos
   */
  async getAllAirports(hubsOnly: boolean = false): Promise<AirportSummary[]> {
    try {
      return await graphRepository.listAirports(hubsOnly);
    } catch (error) {
      console.error("Error fetching airports:", error);
      throw error;
    }
  }

  /**
   * Obtiene solo los hubs
   */
  async getHubs(): Promise<AirportSummary[]> {
    return this.getAllAirports(true);
  }

  /**
   * Lista todas las rutas
   */
  async getAllRoutes(includeBlocked: boolean = false): Promise<RouteDto[]> {
    try {
      return await graphRepository.listRoutes(includeBlocked);
    } catch (error) {
      console.error("Error fetching routes:", error);
      throw error;
    }
  }

  /**
   * Obtiene rutas desde un aeropuerto específico
   */
  async getAvailableDestinations(
    airportId: string,
    includeBlocked: boolean = false
  ): Promise<RouteDto[]> {
    try {
      return await graphRepository.getRoutesFrom(airportId, includeBlocked);
    } catch (error) {
      console.error(
        `Error fetching routes from ${airportId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene resumen estadístico de la red
   */
  async getNetworkStatistics(): Promise<NetworkSummary> {
    try {
      return await graphRepository.getNetworkSummary();
    } catch (error) {
      console.error("Error fetching network summary:", error);
      throw error;
    }
  }

  /**
   * Verifica si un aeropuerto existe
   */
  async validateAirport(airportId: string): Promise<boolean> {
    try {
      return await graphRepository.airportExists(airportId);
    } catch (error) {
      console.error(`Error validating airport ${airportId}:`, error);
      return false;
    }
  }
}

export const graphService = new GraphService();
