import { api } from "../api/api";

export class PlannerRepository {
  async calculateOptimalRoute(payload: unknown) {
    const response = await api.post(
      "/planner/optimal-route",
      payload
    );

    return response.data;
  }
}