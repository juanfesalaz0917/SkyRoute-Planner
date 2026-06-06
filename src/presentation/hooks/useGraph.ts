import { useState, useEffect, useCallback } from "react";
import { graphService, type AirportDetail, type AirportSummary, type NetworkSummary, type RouteDto } from "../../application/services";


interface UseGraphState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obtener información de un aeropuerto
 */
export function useAirportDetails(airportId: string | null) {
  const [state, setState] = useState<UseGraphState<AirportDetail>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!airportId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchAirport = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const airport = await graphService.getAirportDetails(airportId);
        setState({ data: airport, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    fetchAirport();
  }, [airportId]);

  return state;
}

/**
 * Hook para obtener lista de aeropuertos
 */
export function useAirports(hubsOnly: boolean = false) {
  const [state, setState] = useState<UseGraphState<AirportSummary[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchAirports = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const airports = await graphService.getAllAirports(hubsOnly);
        setState({ data: airports, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    fetchAirports();
  }, [hubsOnly]);

  return state;
}

/**
 * Hook para obtener solo los hubs
 */
export function useHubs() {
  return useAirports(true);
}

/**
 * Hook para obtener todas las rutas
 */
export function useRoutes(includeBlocked: boolean = false) {
  const [state, setState] = useState<UseGraphState<RouteDto[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const routes = await graphService.getAllRoutes(includeBlocked);
        setState({ data: routes, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    fetchRoutes();
  }, [includeBlocked]);

  return state;
}

/**
 * Hook para obtener rutas disponibles desde un aeropuerto
 */
export function useAvailableDestinations(
  airportId: string | null,
  includeBlocked: boolean = false
) {
  const [state, setState] = useState<UseGraphState<RouteDto[]>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!airportId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchDestinations = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const destinations = await graphService.getAvailableDestinations(
          airportId,
          includeBlocked
        );
        setState({ data: destinations, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    fetchDestinations();
  }, [airportId, includeBlocked]);

  return state;
}

/**
 * Hook para obtener estadísticas de la red
 */
export function useNetworkStatistics() {
  const [state, setState] = useState<UseGraphState<NetworkSummary>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const stats = await graphService.getNetworkStatistics();
      setState({ data: stats, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

/**
 * Hook para validar si un aeropuerto existe
 */
export function useAirportValidation(airportId: string | null) {
  const [state, setState] = useState<UseGraphState<boolean>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!airportId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const validateAirport = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const exists = await graphService.validateAirport(airportId);
        setState({ data: exists, loading: false, error: null });
      } catch (error) {
        setState({
          data: false,
          loading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    validateAirport();
  }, [airportId]);

  return state;
}
