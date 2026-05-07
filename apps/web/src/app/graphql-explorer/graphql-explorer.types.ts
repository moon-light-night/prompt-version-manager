import type { ElementType } from "react";
import type { Tag as TagType } from "@pvm/shared";

export type TabKey = "prompts" | "tags" | "dashboard";

export interface TabConfigItem {
  key: TabKey;
  label: string;
  icon: ElementType;
}

export interface GQLPromptItem {
  id: string;
  title: string;
  status: string;
  versionCount: number;
  testCaseCount: number;
  updatedAt: string;
  tags: TagType[];
  latestVersion: {
    versionNumber: number;
    variables: string[];
    label: string | null;
  } | null;
}

export interface PromptsData {
  prompts: {
    total: number;
    items: GQLPromptItem[];
  };
}

export interface TagsData {
  tags: TagType[];
}

export interface DashboardData {
  dashboardSummary: {
    totalPrompts: number;
    activePrompts: number;
    archivedPrompts: number;
    totalVersions: number;
    totalTestCases: number;
    totalRuns: number;
  };
}
