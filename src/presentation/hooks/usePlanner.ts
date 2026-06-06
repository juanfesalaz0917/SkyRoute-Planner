import { useState, useEffect, useCallback } from "react";
import { plannerService, type ItineraryAlternative, type RouteResult, type TravelerState } from "../../application/services";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar la mejor ruta
 */
export function useBestRoute(
  origin: string | null,
  destination: string | null,
  criterion: "costo" | "tiempo" | "distancia" = "costo"
) {
  const [state, setState] = useState<UseAsyncState<RouteResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const search = useCallback(async () => {
    if (!origin || !destination) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const route = await plannerService.findBestRoute(
        origin,
        destination,
        criterion
      );
      setState({ data: route, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, [origin, destination, criterion]);

  useEffect(() => {
    search();
  }, [origin, destination, criterion, search]);

  return { ...state, search };
}

/**
 * Hook para generar alternativas de itinerario
 */
export function useItineraryAlternatives(
  origin: string | null,
  budget: number | null,
  availableHours: number | null
) {
  const [state, setState] = useState<UseAsyncState<ItineraryAlternative[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const generate = useCallback(async () => {
    if (!origin || budget === null || availableHours === null) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const alternatives =
        await plannerService.generateItineraryAlternatives(
          origin,
          budget,
          availableHours
        );
      setState({ data: alternatives, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, [origin, budget, availableHours]);

  useEffect(() => {
    generate();
  }, [origin, budget, availableHours, generate]);

  return { ...state, generate };
}

/**
 * Hook para gestionar el estado de un viaje interactivo
 */
export function useInteractiveTrip() {
  const [state, setState] = useState<UseAsyncState<TravelerState>>({
    data: null,
    loading: false,
    error: null,
  });

  const startTrip = useCallback(
    async (origin: string, budget: number, totalHours?: number) => {
      setState({ data: null, loading: true, error: null });
      try {
        const tripState = await plannerService.startInteractiveTrip(
          origin,
          budget,
          totalHours
        );
        setState({ data: tripState, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    },
    []
  );

  const executeStep = useCallback(
    async (
      currentState: TravelerState,
      destination: string,
      aircraft: string
    ) => {
      setState({ ...state, loading: true });
      try {
        const result = await plannerService.executeNextStep(
          currentState,
          destination,
          aircraft
        );
        setState({
          data: result.estado_actualizado,
          loading: false,
          error: null,
        });
        return result;
      } catch (error) {
        setState({
          ...state,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
        throw error;
      }
    },
    [state]
  );

  const getRecommendation = useCallback(
    async (criterion: "costo" | "tiempo" | "destinos") => {
      if (!state.data) {
        throw new Error("No trip started");
      }

      try {
        return await plannerService.getRecommendation(state.data, criterion);
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Unknown error");
        setState({ ...state, error: err });
        throw err;
      }
    },
    [state]
  );

  const updateState = useCallback((newState: TravelerState) => {
    setState({ data: newState, loading: false, error: null });
  }, []);

  return {
    ...state,
    startTrip,
    executeStep,
    getRecommendation,
    updateState,
  };
}

/**
 * Hook para calcular estadísticas del viaje
 */
export function useTripStatistics(travelerState: TravelerState | null) {
  return {
    canAfford: (cost: number) =>
      travelerState ? plannerService.canAffordTrip(travelerState, cost) : false,
    remainingHours: travelerState
      ? plannerService.getRemainingHours(travelerState)
      : 0,
    budgetUsage: travelerState
      ? plannerService.getBudgetUsagePercentage(travelerState)
      : 0,
    timeUsage: travelerState
      ? plannerService.getTimeUsagePercentage(travelerState)
      : 0,
  };
}
