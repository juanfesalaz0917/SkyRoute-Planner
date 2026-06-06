import { plannerRepository, type ItineraryAlternative, type RouteResult, type StepAdvanceResult, type TravelerState } from "../../infrastructure/api/plannerRepository";


class PlannerService {
  /**
   * Busca la mejor ruta entre dos ciudades según el criterio especificado
   */
  async findBestRoute(
    origin: string,
    destination: string,
    criterion: "costo" | "tiempo" | "distancia" = "costo",
    options?: {
      includeSecondary?: boolean;
      transportTypes?: string[];
    }
  ): Promise<RouteResult | null> {
    try {
      return await plannerRepository.calculateOptimalRoute(
        origin.toUpperCase(),
        destination.toUpperCase(),
        criterion,
        options?.includeSecondary ?? true,
        options?.transportTypes
      );
    } catch (error) {
      console.error(
        `Error finding best route from ${origin} to ${destination}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Genera dos alternativas de viaje con diferentes criterios
   */
  async generateItineraryAlternatives(
    origin: string,
    budget: number,
    availableHours: number,
    options?: {
      includeSecondary?: boolean;
      transportTypes?: string[];
    }
  ): Promise<ItineraryAlternative[]> {
    try {
      const alternatives = await plannerRepository.proposeItineraries(
        origin.toUpperCase(),
        budget,
        availableHours,
        options?.includeSecondary ?? true,
        options?.transportTypes
      );
      return alternatives;
    } catch (error) {
      console.error("Error generating itineraries:", error);
      throw error;
    }
  }

  /**
   * Inicia un nuevo viaje interactivo
   */
  async startInteractiveTrip(
    origin: string,
    budget: number,
    totalHours: number = 120
  ): Promise<TravelerState> {
    try {
      const state = await plannerRepository.initializeTrip(
        origin.toUpperCase(),
        budget,
        totalHours
      );
      return state;
    } catch (error) {
      console.error("Error starting trip:", error);
      throw error;
    }
  }

  /**
   * Realiza el siguiente paso en el viaje (vuelo a otro aeropuerto)
   */
  async executeNextStep(
    currentState: TravelerState,
    destinationAirport: string,
    aircraft: string
  ): Promise<StepAdvanceResult> {
    try {
      return await plannerRepository.advanceStep(
        currentState,
        destinationAirport.toUpperCase(),
        aircraft
      );
    } catch (error) {
      console.error("Error executing step:", error);
      throw error;
    }
  }

  /**
   * Obtiene una recomendación para el siguiente paso
   */
  async getRecommendation(
    currentState: TravelerState,
    criterion: "costo" | "tiempo" | "destinos"
  ): Promise<{
    recommendedAirport: string;
    reason: string;
    benefits: string[];
  }> {
    try {
      const recommendation = await plannerRepository.getStepRecommendation(
        currentState,
        criterion
      );
      return {
        recommendedAirport: recommendation.aeropuerto_recomendado,
        reason: recommendation.razon,
        benefits: recommendation.beneficios,
      };
    } catch (error) {
      console.error("Error getting recommendation:", error);
      throw error;
    }
  }

  /**
   * Calcula si hay suficientes recursos para un viaje
   */
  canAffordTrip(state: TravelerState, cost: number): boolean {
    return state.presupuesto_actual >= cost;
  }

  /**
   * Calcula el tiempo restante en horas
   */
  getRemainingHours(state: TravelerState): number {
    return state.tiempo_restante_min / 60;
  }

  /**
   * Calcula el porcentaje de presupuesto usado
   */
  getBudgetUsagePercentage(state: TravelerState): number {
    return (
      (state.gasto_total / state.presupuesto_inicial) * 100
    );
  }

  /**
   * Calcula el porcentaje de tiempo usado
   */
  getTimeUsagePercentage(state: TravelerState): number {
    return (
      ((state.tiempo_total_min - state.tiempo_restante_min) /
        state.tiempo_total_min) *
      100
    );
  }
}

export const plannerService = new PlannerService();
