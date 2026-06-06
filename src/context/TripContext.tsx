import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface Location {
  lat: number;
  lng: number;
  airportCode?: string;
}

export interface Activity {
  id: string;
  name: string;
  timestamp: number;
}

export interface Job {
  id: string;
  title: string;
  timestamp: number;
}

export interface CurrentTrip {
  location: Location;
  budget: number;
  timeRemaining: number; // in minutes
  activitiesCompleted: Activity[];
  jobsAccepted: Job[];
  startTime: number;
  score: number;
}

export interface TripContextType {
  currentTrip: CurrentTrip | null;
  updateLocation: (location: Location) => void;
  deductBudget: (amount: number) => void;
  deductTime: (minutes: number) => void;
  addActivity: (activity: Activity) => void;
  addJob: (job: Job) => void;
  startNewTrip: (initialBudget: number, initialTime: number) => void;
  resetTrip: () => void;
  saveTripState: () => void;
  loadTripState: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const DEFAULT_TRIP: CurrentTrip = {
  location: { lat: 0, lng: 0 },
  budget: 0,
  timeRemaining: 0,
  activitiesCompleted: [],
  jobsAccepted: [],
  startTime: Date.now(),
  score: 0,
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState<CurrentTrip | null>(null);
  const [, setTripStorage] = useLocalStorage<CurrentTrip | null>('skyroute_trip', null);
  const [, setScoreStorage] = useLocalStorage<number>('skyroute_score', 0);

  // Load trip state on mount
  useEffect(() => {
    loadTripState();
  }, []);

  const updateLocation = useCallback((location: Location) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, location };
    });
  }, []);

  const deductBudget = useCallback((amount: number) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, budget: Math.max(0, prev.budget - amount) };
    });
  }, []);

  const deductTime = useCallback((minutes: number) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, timeRemaining: Math.max(0, prev.timeRemaining - minutes) };
    });
  }, []);

  const addActivity = useCallback((activity: Activity) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activitiesCompleted: [...prev.activitiesCompleted, activity],
        score: prev.score + 10, // Award points for activities
      };
    });
  }, []);

  const addJob = useCallback((job: Job) => {
    setCurrentTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        jobsAccepted: [...prev.jobsAccepted, job],
        score: prev.score + 25, // Award points for jobs
      };
    });
  }, []);

  const startNewTrip = useCallback((initialBudget: number, initialTime: number) => {
    const newTrip: CurrentTrip = {
      ...DEFAULT_TRIP,
      budget: initialBudget,
      timeRemaining: initialTime,
      startTime: Date.now(),
    };
    setCurrentTrip(newTrip);
  }, []);

  const resetTrip = useCallback(() => {
    setCurrentTrip(null);
    setTripStorage(null);
    setScoreStorage(0);
  }, [setTripStorage, setScoreStorage]);

  const saveTripState = useCallback(() => {
    if (currentTrip) {
      setTripStorage(currentTrip);
      setScoreStorage(currentTrip.score);
    }
  }, [currentTrip, setTripStorage, setScoreStorage]);

  const loadTripState = useCallback(() => {
    const [savedTrip] = useLocalStorage<CurrentTrip | null>('skyroute_trip', null);
    if (savedTrip) {
      setCurrentTrip(savedTrip);
    }
  }, []);

  const value: TripContextType = {
    currentTrip,
    updateLocation,
    deductBudget,
    deductTime,
    addActivity,
    addJob,
    startNewTrip,
    resetTrip,
    saveTripState,
    loadTripState,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};
