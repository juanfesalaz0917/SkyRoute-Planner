/**
 * Custom React Hooks Index
 * 
 * Centralizes all custom hooks for easy importing
 * in React components.
 */

// Graph Hooks
export {
  useAirportDetails,
  useAirports,
  useHubs,
  useRoutes,
  useAvailableDestinations,
  useNetworkStatistics,
  useAirportValidation,
} from "./useGraph";

// Planner Hooks
export {
  useBestRoute,
  useItineraryAlternatives,
  useInteractiveTrip,
  useTripStatistics,
} from "./usePlanner";

// Interruption Hooks
export {
  useBlockedRoutes,
  useIsRouteBlocked,
  useRouteRecalculation,
  useInterruptionStatus,
} from "./useInterruption";

// Report Hooks
export {
  useTravelReport,
  useReportExport,
  useAggregateStatistics,
  useReportAnalysis,
} from "./useReport";
