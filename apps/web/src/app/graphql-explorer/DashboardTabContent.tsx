import { Skeleton } from "@/components/ui/skeleton";
import { GraphQLErrorMessage } from "./GraphQLErrorMessage";
import { GraphQLQueryPanel } from "./GraphQLQueryPanel";
import { DASHBOARD_QUERY, DASHBOARD_SKELETON_COUNT } from "./graphql-explorer.constants";
import type { DashboardData } from "./graphql-explorer.types";

interface DashboardTabContentProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: DashboardData;
}

export const DashboardTabContent = ({ isLoading, isError, error, data }: DashboardTabContentProps) => {
  return (
    <div className="space-y-4">
      <GraphQLQueryPanel query={DASHBOARD_QUERY} />

      {isError && <GraphQLErrorMessage error={error} />}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: DASHBOARD_SKELETON_COUNT }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(data.dashboardSummary).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-border bg-card p-4"
              data-testid="gql-summary-card"
            >
              <p className="text-xs text-muted-foreground font-mono">{key}</p>
              <p className="text-2xl font-bold mt-1">{String(value)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
