import {
  reportRepository,
  type TravelReport,
} from "../../infrastructure/api/reportRepository";
import type { TravelerState } from "../../infrastructure/api/plannerRepository";

class ReportService {
  /**
   * Genera un reporte completo del viaje
   */
  async generateTravelReport(finalState: TravelerState): Promise<TravelReport> {
    try {
      return await reportRepository.generateReport(finalState);
    } catch (error) {
      console.error("Error generating travel report:", error);
      throw error;
    }
  }

  /**
   * Exporta el reporte en PDF
   */
  async exportAsPDF(finalState: TravelerState): Promise<void> {
    try {
      const blob = await reportRepository.exportReportPDF(finalState);
      this.downloadFile(blob, "travel_report.pdf");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      throw error;
    }
  }

  /**
   * Exporta el reporte en CSV
   */
  async exportAsCSV(finalState: TravelerState): Promise<void> {
    try {
      const blob = await reportRepository.exportReportCSV(finalState);
      this.downloadFile(blob, "travel_report.csv");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas agregadas
   */
  async getAggregateStatistics(): Promise<{
    completedTrips: number;
    averageBudget: number;
    averageTimeHours: number;
    mostPopularDestination: string;
  }> {
    try {
      const stats = await reportRepository.getStatistics();
      return {
        completedTrips: stats.viajes_completados,
        averageBudget: stats.presupuesto_promedio,
        averageTimeHours: stats.tiempo_promedio_horas,
        mostPopularDestination: stats.destino_mas_popular,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }

  /**
   * Calcula el ROI (Return on Investment) del viaje
   */
  calculateROI(report: TravelReport): number {
    const { total_ganado, total_gastado } = report.resumen;
    if (total_gastado === 0) return 0;
    return ((total_ganado - total_gastado) / total_gastado) * 100;
  }

  /**
   * Obtiene un resumen textual del viaje
   */
  generateSummaryText(report: TravelReport): string {
    const {
      presupuesto_inicial,
      total_gastado,
      total_ganado,
      saldo_final,
      tiempo_total_min,
    } = report.resumen;

    const {
      cantidad: destinos,
      destinos: destinosList,
    } = report.destinos_visitados;

    const tiempoHoras = (tiempo_total_min / 60).toFixed(1);
    const roi = this.calculateROI(report);

    return `
    RESUMEN DEL VIAJE
    ================
    
    Destinos visitados: ${destinos} (${destinosList.join(", ")})
    Duración total: ${tiempoHoras} horas
    
    FINANZAS
    --------
    Presupuesto inicial: $${presupuesto_inicial.toFixed(2)}
    Total gastado: $${total_gastado.toFixed(2)}
    Total ganado: $${total_ganado.toFixed(2)}
    Saldo final: $${saldo_final.toFixed(2)}
    ROI: ${roi.toFixed(2)}%
    
    ACTIVIDADES
    -----------
    Vuelos realizados: ${report.vuelos.cantidad}
    Actividades completadas: ${report.actividades.cantidad}
    Trabajos realizados: ${report.trabajos.cantidad}
    `;
  }

  /**
   * Descarga un archivo
   */
  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
