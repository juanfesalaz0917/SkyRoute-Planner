import { useState, useEffect, useCallback } from "react";
import { interruptionService, type BlockedRoute, type RecalculationResult, type TravelerState } from "../../application/services";


interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para gestionar rutas bloqueadas
 */
export function useBlockedRoutes() {
  const [state, setState] = useState<UseAsyncState<BlockedRoute[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchBlockedRoutes = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const routes = await interruptionService.getBlockedRoutes();
      setState({ data: routes, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, []);

  const blockRoute = useCallback(
    async (origin: string, destination: string) => {
      try {
        await interruptionService.blockRoute(origin, destination);
        await fetchBlockedRoutes();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Unknown error");
        setState((prev) => ({ ...prev, error: err }));
        throw err;
      }
    },
    [fetchBlockedRoutes]
  );

  const unblockRoute = useCallback(
    async (origin: string, destination: string) => {
      try {
        await interruptionService.unblockRoute(origin, destination);
        await fetchBlockedRoutes();
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Unknown error");
        setState((prev) => ({ ...prev, error: err }));
        throw err;
      }
    },
    [fetchBlockedRoutes]
  );

  useEffect(() => {
    fetchBlockedRoutes();
  }, [fetchBlockedRoutes]);

  return {
    ...state,
    blockRoute,
    unblockRoute,
    refetch: fetchBlockedRoutes,
  };
}

/**
 * Hook para verificar si una ruta está bloqueada
 */
export function useIsRouteBlocked(
  origin: string | null,
  destination: string | null
) {
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!origin || !destination) {
      setIsBlocked(null);
      return;
    }

    const check = async () => {
      setLoading(true);
      setError(null);
      try {
        const blocked = await interruptionService.isRouteBlocked(
          origin,
          destination
        );
        setIsBlocked(blocked);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [origin, destination]);

  return { isBlocked, loading, error };
}

/**
 * Hook para recalcular rutas tras interrupciones
 */
export function useRouteRecalculation(
  currentState: TravelerState | null,
  finalDestination: string | null
) {
  const [state, setState] = useState<UseAsyncState<RecalculationResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const recalculate = useCallback(
    async (criterion: "costo" | "tiempo" | "distancia" = "distancia") => {
      if (!currentState || !finalDestination) {
        setState({
          data: null,
          loading: false,
          error: new Error("Missing current state or destination"),
        });
        return null;
      }

      setState({ data: null, loading: true, error: null });
      try {
        const result = await interruptionService.recalculateRoute(
          currentState,
          finalDestination,
          criterion
        );
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
        return null;
      }
    },
    [currentState, finalDestination]
  );

  return { ...state, recalculate };
}

/**
 * Hook para obtener estado de interrupciones en la red
 */
export function useInterruptionStatus() {
  const [state, setState] = useState<
    UseAsyncState<{
      totalBlockedRoutes: number;
      affectedAirports: string[];
    }>
  >({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const status = await interruptionService.getInterruptionStatus();
      setState({ data: status, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { ...state, refetch: fetchStatus };
}
