import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackendAPI } from '../hooks/useBackendAPI';

export interface Airport {
  id: string;
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Route {
  id: string;
  departureAirport: string;
  arrivalAirport: string;
  distance: number;
  duration: number;
  cost: number;
}

export interface NetworkData {
  airports: Airport[];
  routes: Route[];
  graph?: Record<string, unknown>;
}

export interface AppContextType {
  airports: Airport[];
  routes: Route[];
  networkData: NetworkData | null;
  isLoading: boolean;
  error: string | null;
  refetchData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: networkData, loading, error } = useBackendAPI();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (networkData && typeof networkData === 'object') {
      const data = networkData as Record<string, unknown>;
      if (Array.isArray(data.airports)) {
        setAirports(data.airports);
      }
      if (Array.isArray(data.routes)) {
        setRoutes(data.routes);
      }
    }
  }, [networkData]);

  const refetchData = () => {
    // Trigger data refresh
  };

  const typedNetworkData: NetworkData | null =
    networkData && typeof networkData === 'object' && 'airports' in networkData && 'routes' in networkData
      ? (networkData as unknown as NetworkData)
      : null;

  const value: AppContextType = {
    airports,
    routes,
    networkData: typedNetworkData,
    isLoading: loading,
    error: error || null,
    refetchData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
