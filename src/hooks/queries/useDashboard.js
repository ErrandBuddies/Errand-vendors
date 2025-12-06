import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api";
import { QUERY_KEYS } from "./queryKeys";

/**
 * Query hook for fetching dashboard data
 */
export function useDashboardQuery(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS(params),
    queryFn: async () => {
      const response = await dashboardService.getVendorProducts(params);
      return response.data;
    },
  });
}
