import { api } from "../api/api";

export class GraphRepository {
  async getSummary() {
    const response = await api.get("/graph/summary");
    return response.data;
  }

  async getAirports() {
    const response = await api.get("/graph/airports");
    return response.data;
  }

  async getRoutes() {
    const response = await api.get("/graph/routes");
    return response.data;
  }
}