import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface BackendAPIResponse {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  getNetworkData: () => Promise<Record<string, unknown>>;
  getBasicPlan: (params: Record<string, unknown>) => Promise<Record<string, unknown>>;
  getAdvancedPlan: (params: Record<string, unknown>) => Promise<Record<string, unknown>>;
  makeRequest: (endpoint: string, method?: string, payload?: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

const createAxiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useBackendAPI = (): BackendAPIResponse => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const axiosInstance = createAxiosInstance();

  const makeRequest = async (
    endpoint: string,
    method: string = 'GET',
    payload?: Record<string, unknown>
  ): Promise<Record<string, unknown>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data: payload,
      });
      setData(response.data);
      return response.data as Record<string, unknown>;
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data instanceof Object
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message || 'An error occurred';

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkData = async (): Promise<Record<string, unknown>> => {
    return makeRequest('/network', 'GET');
  };

  const getBasicPlan = async (params: Record<string, unknown>): Promise<Record<string, unknown>> => {
    return makeRequest('/plan/basic', 'POST', params);
  };

  const getAdvancedPlan = async (params: Record<string, unknown>): Promise<Record<string, unknown>> => {
    return makeRequest('/plan/advanced', 'POST', params);
  };

  // Load initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await getNetworkData();
      } catch (err) {
        console.error('Failed to load initial network data:', err);
      }
    };

    fetchInitialData();
  }, []);

  return {
    data,
    loading,
    error,
    getNetworkData,
    getBasicPlan,
    getAdvancedPlan,
    makeRequest,
  };
};
