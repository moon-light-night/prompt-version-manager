import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import type { DashboardSummary, DashboardRecentRun } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";

export type { DashboardSummary, DashboardRecentRun };

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => trpcClient.dashboard.summary.query(),
    staleTime: 30000,
  });
};
