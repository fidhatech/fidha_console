import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboard.api";
import { type DashboardStatistics } from "../../types/general.type";

export const useDashboardQuery = () => {
  return useQuery<DashboardStatistics>({
    queryKey: [
      "dashboard",
    ],
    queryFn: () =>
    dashboardApi(),
    placeholderData: (previousData) => previousData,
  });
};
