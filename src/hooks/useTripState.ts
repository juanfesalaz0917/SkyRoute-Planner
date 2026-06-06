import { useCallback, useEffect } from 'react';
import { useTripContext } from '../context/TripContext';

export interface TripStateHelpers {
  trip: ReturnType<typeof useTripContext>['currentTrip'];
  updateTrip: (updates: Partial<ReturnType<typeof useTripContext>['currentTrip']>) => void;
  isActive: boolean;
  canDeductBudget: (amount: number) => boolean;
  canDeductTime: (minutes: number) => boolean;
  getActivitiesCount: () => number;
  getJobsCount: () => number;
  getTripDuration: () => number;
  remainingBudgetPercentage: () => number;
  remainingTimePercentage: () => number;
}

export const useTripState = (): TripStateHelpers => {
  const tripContext = useTripContext();
  const { currentTrip, updateLocation, deductBudget, deductTime, saveTripState } = tripContext;

  // Auto-save trip state periodically
  useEffect(() => {
    if (!currentTrip) return;

    const interval = setInterval(() => {
      saveTripState();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [currentTrip, saveTripState]);

  const updateTrip = useCallback(
    (updates: Partial<typeof currentTrip> | null) => {
      if (!currentTrip || !updates) return;

      if ('location' in updates && updates.location) {
        updateLocation(updates.location);
      }
      if ('budget' in updates && typeof updates.budget === 'number') {
        const diff = currentTrip.budget - updates.budget;
        if (diff > 0) {
          deductBudget(diff);
        }
      }
      if ('timeRemaining' in updates && typeof updates.timeRemaining === 'number') {
        const diff = currentTrip.timeRemaining - updates.timeRemaining;
        if (diff > 0) {
          deductTime(diff);
        }
      }
    },
    [currentTrip, updateLocation, deductBudget, deductTime]
  );

  const isActive = currentTrip !== null;

  const canDeductBudget = useCallback(
    (amount: number): boolean => {
      if (!currentTrip) return false;
      return currentTrip.budget >= amount;
    },
    [currentTrip]
  );

  const canDeductTime = useCallback(
    (minutes: number): boolean => {
      if (!currentTrip) return false;
      return currentTrip.timeRemaining >= minutes;
    },
    [currentTrip]
  );

  const getActivitiesCount = useCallback((): number => {
    return currentTrip?.activitiesCompleted.length || 0;
  }, [currentTrip]);

  const getJobsCount = useCallback((): number => {
    return currentTrip?.jobsAccepted.length || 0;
  }, [currentTrip]);

  const getTripDuration = useCallback((): number => {
    if (!currentTrip) return 0;
    return Date.now() - currentTrip.startTime;
  }, [currentTrip]);

  const remainingBudgetPercentage = useCallback((): number => {
    if (!currentTrip || currentTrip.budget === 0) return 0;
    const initialBudget = 5000; // Assuming default initial budget
    return (currentTrip.budget / initialBudget) * 100;
  }, [currentTrip]);

  const remainingTimePercentage = useCallback((): number => {
    if (!currentTrip || currentTrip.timeRemaining === 0) return 0;
    const initialTime = 480; // Assuming default initial time (8 hours)
    return (currentTrip.timeRemaining / initialTime) * 100;
  }, [currentTrip]);

  return {
    trip: currentTrip,
    updateTrip,
    isActive,
    canDeductBudget,
    canDeductTime,
    getActivitiesCount,
    getJobsCount,
    getTripDuration,
    remainingBudgetPercentage,
    remainingTimePercentage,
  };
};
