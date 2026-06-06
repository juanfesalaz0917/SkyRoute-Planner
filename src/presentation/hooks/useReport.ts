import { useState, useCallback } from "react";
import { reportService, type TravelerState, type TravelReport } from "../../application/services";


interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para generar reportes de viaje
 */
export function useTravelReport() {
  const [state, setState] = useState<UseAsyncState<TravelReport>>({
    data: null,
    loading: false,
    error: null,
  });

  const generateReport = useCallback(async (finalState: TravelerState) => {
    setState({ data: null, loading: true, error: null });
    try {
      const report = await reportService.generateTravelReport(finalState);
      setState({ data: report, loading: false, error: null });
      return report;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      throw error;
    }
  }, []);

  return { ...state, generateReport };
}

/**
 * Hook para exportar reportes
 */
export function useReportExport() {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportPDF = useCallback(async (finalState: TravelerState) => {
    setExportingPDF(true);
    setError(null);
    try {
      await reportService.exportAsPDF(finalState);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setExportingPDF(false);
    }
  }, []);

  const exportCSV = useCallback(async (finalState: TravelerState) => {
    setExportingCSV(true);
    setError(null);
    try {
      await reportService.exportAsCSV(finalState);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setExportingCSV(false);
    }
  }, []);

  return {
    exportPDF,
    exportCSV,
    exporting: exportingPDF || exportingCSV,
    error,
  };
}

/**
 * Hook para obtener estadísticas agregadas
 */
export function useAggregateStatistics() {
  const [state, setState] = useState<
    UseAsyncState<{
      completedTrips: number;
      averageBudget: number;
      averageTimeHours: number;
      mostPopularDestination: string;
    }>
  >({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStatistics = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const stats = await reportService.getAggregateStatistics();
      setState({ data: stats, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, []);

  return { ...state, fetchStatistics };
}

/**
 * Hook para cálculos de ROI y análisis
 */
export function useReportAnalysis(report: TravelReport | null) {
  return {
    roi: report ? reportService.calculateROI(report) : 0,
    summary: report ? reportService.generateSummaryText(report) : "",
    profitability:
      report && report.resumen.saldo_final > report.resumen.presupuesto_inicial
        ? "positive"
        : report && report.resumen.saldo_final < report.resumen.presupuesto_inicial
          ? "negative"
          : "neutral",
  };
}
