import type { DashboardStatistics } from "../types/general.type";
import api from "./axios";

export const dashboardApi = async (): Promise<DashboardStatistics> => api.get('/statistics');