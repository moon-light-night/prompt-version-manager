import { DASHBOARD_STAT_CARDS } from "./dashboard.constants";
import { DashboardStatCard } from "./DashboardStatCard";

interface DashboardStatsGridProps {
  isLoading: boolean;
  data?: {
    totalPrompts: number;
    activePrompts: number;
    archivedPrompts: number;
    totalVersions: number;
    totalTestCases: number;
    totalRuns: number;
  };
}

export const DashboardStatsGrid = ({ isLoading, data }: DashboardStatsGridProps) => {
  const values = [
    data?.totalPrompts,
    data?.activePrompts,
    data?.archivedPrompts,
    data?.totalVersions,
    data?.totalTestCases,
    data?.totalRuns,
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {DASHBOARD_STAT_CARDS.map((card, index) => (
        <DashboardStatCard
          key={card.label}
          label={card.label}
          icon={card.icon}
          href={card.href}
          accent={card.accent}
          value={values[index]}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
