import {
  interruptionRepository,
  type BlockedRoute,
  type RecalculationResult,
} from "../../infrastructure/api/interruptionRepository";
import type { TravelerState } from "../../infrastructure/api/plannerRepository";

class InterruptionService {
  /**
   * Bloquea una ruta (simula una interrupción)
   */
  async blockRoute(origin: string, destination: string): Promise<void> {
    try {
      await interruptionRepository.blockRoute(
        origin.toUpperCase(),
        destination.toUpperCase()
      );
    } catch (error) {
      console.error(
        `Error blocking route from ${origin} to ${destination}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Desbloquea una ruta
   */
  async unblockRoute(origin: string, destination: string): Promise<void> {
    try {
      await interruptionRepository.unblockRoute(
        origin.toUpperCase(),
        destination.toUpperCase()
      );
    } catch (error) {
      console.error(
        `Error unblocking route from ${origin} to ${destination}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Obtiene todas las rutas bloqueadas actualmente
   */
  async getBlockedRoutes(): Promise<BlockedRoute[]> {
    try {
      return await interruptionRepository.listBlockedRoutes();
    } catch (error) {
      console.error("Error fetching blocked routes:", error);
      throw error;
    }
  }

  /**
   * Verifica si una ruta está bloqueada
   */
  async isRouteBlocked(
    origin: string,
    destination: string
  ): Promise<boolean> {
    try {
      const blockedRoutes = await this.getBlockedRoutes();
      return blockedRoutes.some(
        (route) =>
          route.origen === origin.toUpperCase() &&
          route.destino === destination.toUpperCase()
      );
    } catch (error) {
      console.error("Error checking if route is blocked:", error);
      return false;
    }
  }

  /**
   * Recalcula el itinerario después de una interrupción
   */
  async recalculateRoute(
    currentState: TravelerState,
    finalDestination: string,
    criterion: "costo" | "tiempo" | "distancia" = "distancia",
    options?: {
      includeSecondary?: boolean;
      transportTypes?: string[];
    }
  ): Promise<RecalculationResult> {
    try {
      return await interruptionRepository.recalculateItinerary(
        currentState,
        finalDestination.toUpperCase(),
        criterion,
        options?.includeSecondary ?? true,
        options?.transportTypes
      );
    } catch (error) {
      console.error("Error recalculating itinerary:", error);
      throw error;
    }
  }

  /**
   * Obtiene información sobre interrupciones en la red
   */
  async getInterruptionStatus(): Promise<{
    totalBlockedRoutes: number;
    affectedAirports: string[];
  }> {
    try {
      const info = await interruptionRepository.getInterruptionInfo();
      return {
        totalBlockedRoutes: info.rutas_bloqueadas_total,
        affectedAirports: info.aeropuertos_afectados,
      };
    } catch (error) {
      console.error("Error fetching interruption info:", error);
      throw error;
    }
  }
}

export const interruptionService = new InterruptionService();
