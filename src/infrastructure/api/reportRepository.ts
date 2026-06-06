import { api } from "./api";
import type { TravelerState } from "./plannerRepository";

export interface TravelReport {
  resumen: {
    presupuesto_inicial: number;
    total_gastado: number;
    total_ganado: number;
    saldo_final: number;
    tiempo_total_min: number;
    tiempo_restante_min: number;
  };
  destinos_visitados: {
    cantidad: number;
    destinos: string[];
  };
  vuelos: {
    cantidad: number;
    detalle: Array<{
      origen: string;
      destino: string;
      aeronave: string;
      costo: number;
      tiempo_min: number;
    }>;
  };
  actividades: {
    cantidad: number;
    detalle: Array<{
      id: string;
      nombre: string;
      duracion_min: number;
      costo: number;
    }>;
  };
  trabajos: {
    cantidad: number;
    detalle: Array<{
      id: string;
      descripcion: string;
      duracion_min: number;
      pago: number;
    }>;
  };
}

export const reportRepository = {
  /**
   * Genera un reporte completo del viaje desde el estado final
   */
  generateReport: async (estadoFinal: TravelerState): Promise<TravelReport> => {
    const response = await api.post("/reports/generar-reporte", {
      estado_final: estadoFinal,
    });
    return response.data;
  },

  /**
   * Exporta el reporte en formato PDF
   */
  exportReportPDF: async (estadoFinal: TravelerState): Promise<Blob> => {
    const response = await api.post("/reports/exportar-pdf", {
      estado_final: estadoFinal,
    }, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Exporta el reporte en formato CSV
   */
  exportReportCSV: async (estadoFinal: TravelerState): Promise<Blob> => {
    const response = await api.post("/reports/exportar-csv", {
      estado_final: estadoFinal,
    }, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Obtiene estadísticas agregadas de viajes
   */
  getStatistics: async (): Promise<{
    viajes_completados: number;
    presupuesto_promedio: number;
    tiempo_promedio_horas: number;
    destino_mas_popular: string;
  }> => {
    const response = await api.get("/reports/estadisticas");
    return response.data;
  },
};
