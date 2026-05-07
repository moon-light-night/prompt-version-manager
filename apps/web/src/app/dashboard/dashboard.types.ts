import type { ElementType } from "react";
import type { DashboardRecentRun } from "@/lib/trpc";
import type { PromptWithMeta } from "@pvm/shared";

export interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: ElementType;
  href?: string;
  accent?: string;
  isLoading?: boolean;
}

export interface RecentPromptsListProps {
  items?: PromptWithMeta[];
  isLoading: boolean;
}

export interface RecentRunsListProps {
  items?: DashboardRecentRun[];
  isLoading: boolean;
}
