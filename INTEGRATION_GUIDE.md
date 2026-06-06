# Backend Integration Guide

## Overview

This frontend project is fully integrated with the Python backend's five core services. The integration follows a layered architecture:

- **API Layer**: `src/infrastructure/api/` - Direct API calls using axios
- **Service Layer**: `src/application/services/` - Business logic and orchestration
- **React Hooks**: `src/presentation/hooks/` - React-friendly custom hooks

## Backend Services

### 1. GraphService
**Purpose**: Read-only access to the airport network graph structure

**Available Methods in Frontend**:
- `graphService.getAirportDetails(id)` - Get complete airport information
- `graphService.getAllAirports(hubsOnly)` - List all or just hub airports
- `graphService.getHubs()` - List only hub airports
- `graphService.getAllRoutes(includeBlocked)` - List all routes
- `graphService.getAvailableDestinations(airportId)` - Get next-hop destinations
- `graphService.getNetworkStatistics()` - Get network summary
- `graphService.validateAirport(id)` - Check if airport exists

**React Hooks**:
```tsx
import { useAirports, useAirportDetails, useHubs, useRoutes, useAvailableDestinations } from '@/presentation/hooks';

// In your component
const { data: airports, loading, error } = useAirports();
const { data: airportDetails } = useAirportDetails('BOG');
const { data: destinations } = useAvailableDestinations('BOG');
```

### 2. BasicPlannerService
**Purpose**: Calculate optimal routes and propose itineraries

**Available Methods in Frontend**:
- `plannerService.findBestRoute(origin, destination, criterion)` - Find optimal route by cost/time/distance
- `plannerService.generateItineraryAlternatives(origin, budget, hours)` - Generate two itinerary options

**React Hooks**:
```tsx
import { useBestRoute, useItineraryAlternatives } from '@/presentation/hooks';

// Find best route
const { data: route, loading } = useBestRoute('BOG', 'MIA', 'costo');

// Generate alternatives
const { data: alternatives } = useItineraryAlternatives('BOG', 5000, 120);
```

### 3. AdvancedPlannerService
**Purpose**: Step-by-step trip simulation with dynamic budget

**Available Methods in Frontend**:
- `plannerService.startInteractiveTrip(origin, budget, hours)` - Initialize trip
- `plannerService.executeNextStep(state, destination, aircraft)` - Execute a flight
- `plannerService.getRecommendation(state, criterion)` - Get step recommendation

**React Hooks**:
```tsx
import { useInteractiveTrip, useTripStatistics } from '@/presentation/hooks';

// Manage trip state
const { data: state, startTrip, executeStep, getRecommendation } = useInteractiveTrip();

// Calculate statistics
const { remainingHours, budgetUsage, timeUsage } = useTripStatistics(state);

// Usage example
await startTrip('BOG', 10000, 120);
const result = await executeStep(state, 'MIA', 'Airbus A320');
const recommendation = await getRecommendation(state, 'costo');
```

### 4. InterruptionService
**Purpose**: Handle route interruptions and recalculations

**Available Methods in Frontend**:
- `interruptionService.blockRoute(origin, destination)` - Block a route
- `interruptionService.unblockRoute(origin, destination)` - Unblock a route
- `interruptionService.getBlockedRoutes()` - List blocked routes
- `interruptionService.isRouteBlocked(origin, destination)` - Check if route is blocked
- `interruptionService.recalculateRoute(state, destination, criterion)` - Recalculate after interruption
- `interruptionService.getInterruptionStatus()` - Get network interruption info

**React Hooks**:
```tsx
import { useBlockedRoutes, useIsRouteBlocked, useRouteRecalculation, useInterruptionStatus } from '@/presentation/hooks';

// Manage blocked routes
const { data: blockedRoutes, blockRoute, unblockRoute } = useBlockedRoutes();

// Check if specific route is blocked
const { isBlocked } = useIsRouteBlocked('BOG', 'MIA');

// Recalculate after interruption
const { data: result, recalculate } = useRouteRecalculation(state, 'MIA');
await recalculate('distancia');
```

### 5. ReportService
**Purpose**: Generate travel reports and statistics

**Available Methods in Frontend**:
- `reportService.generateTravelReport(finalState)` - Create complete report
- `reportService.exportAsPDF(finalState)` - Download PDF report
- `reportService.exportAsCSV(finalState)` - Download CSV report
- `reportService.getAggregateStatistics()` - Get system-wide statistics
- `reportService.calculateROI(report)` - Calculate return on investment
- `reportService.generateSummaryText(report)` - Generate text summary

**React Hooks**:
```tsx
import { useTravelReport, useReportExport, useAggregateStatistics, useReportAnalysis } from '@/presentation/hooks';

// Generate report
const { data: report, generateReport } = useTravelReport();
await generateReport(finalState);

// Export reports
const { exportPDF, exportCSV } = useReportExport();
await exportPDF(finalState);

// Get statistics
const { data: stats } = useAggregateStatistics();

// Analyze report
const { roi, summary, profitability } = useReportAnalysis(report);
```

## Complete Component Example

```tsx
import { useInteractiveTrip, useTripStatistics, useAvailableDestinations, useInterruptionStatus, useTravelReport } from '@/presentation/hooks';

export function TripPlannerComponent() {
  const trip = useInteractiveTrip();
  const stats = useTripStatistics(trip.data);
  const destinations = useAvailableDestinations(trip.data?.aeropuerto_actual);
  const interruptions = useInterruptionStatus();
  const report = useTravelReport();

  const handleStartTrip = async () => {
    await trip.startTrip('BOG', 10000, 120);
  };

  const handleSelectDestination = async (destination: string) => {
    try {
      const result = await trip.executeStep(trip.data!, destination, 'Airbus A320');
      // Handle step result
    } catch (error) {
      console.error('Failed to execute step:', error);
    }
  };

  const handleFinishTrip = async () => {
    if (trip.data) {
      const travelReport = await report.generateReport(trip.data);
      // Display report
    }
  };

  if (!trip.data) {
    return <StartTripForm onStart={handleStartTrip} />;
  }

  return (
    <div>
      <h2>Current Trip: {trip.data.aeropuerto_actual}</h2>
      <div>
        <p>Budget Usage: {stats.budgetUsage.toFixed(1)}%</p>
        <p>Time Usage: {stats.timeUsage.toFixed(1)}%</p>
        <p>Remaining Hours: {stats.remainingHours.toFixed(1)}</p>
      </div>

      {interruptions.data?.totalBlockedRoutes > 0 && (
        <Alert severity="warning">
          {interruptions.data.totalBlockedRoutes} routes are blocked
        </Alert>
      )}

      <DestinationSelector
        destinations={destinations.data || []}
        onSelect={handleSelectDestination}
      />

      <Button onClick={handleFinishTrip}>Finish Trip & Generate Report</Button>
    </div>
  );
}
```

## API Response Types

All types are exported from the hooks for TypeScript support:

```tsx
import type {
  TravelerState,
  TravelReport,
  RouteResult,
  ItineraryAlternative,
  BlockedRoute,
  AirportDetail,
  NetworkSummary,
} from '@/presentation/hooks';
```

## Error Handling

All hooks include error states:

```tsx
const { data, loading, error } = useAirports();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} />;
if (!data) return null;

return <AirportList airports={data} />;
```

## Best Practices

1. **Use hooks instead of services directly** - Hooks handle loading/error states
2. **Leverage TypeScript types** - Full type safety throughout
3. **Handle errors gracefully** - All operations can fail
4. **Avoid unnecessary re-fetches** - Hooks manage dependencies automatically
5. **Cache data when possible** - Use memoization for expensive calculations

## Configuration

Backend URL is configured in `src/infrastructure/api/api.ts`:

```typescript
export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
```

Change the `baseURL` to match your backend deployment.

## Testing

To test the integration:

1. Ensure backend is running on `http://localhost:8000`
2. Start the frontend dev server
3. Open browser console to see API calls
4. Use React DevTools to inspect hook states
