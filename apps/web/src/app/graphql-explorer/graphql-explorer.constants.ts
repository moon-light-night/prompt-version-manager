import { GitBranch, Layers, Tag } from "lucide-react";
import type { TabConfigItem } from "./graphql-explorer.types";

export const PROMPTS_QUERY = `
  query PromptsExplorer($limit: Int, $status: PromptStatus) {
    prompts(limit: $limit, status: $status) {
      total
      items {
        id
        title
        status
        versionCount
        testCaseCount
        updatedAt
        tags {
          id
          name
          color
        }
        latestVersion {
          versionNumber
          variables
          label
        }
      }
    }
  }
`;

export const TAGS_QUERY = `
  query TagsExplorer {
    tags {
      id
      name
      color
      createdAt
    }
  }
`;

export const DASHBOARD_QUERY = `
  query DashboardSummaryExplorer {
    dashboardSummary {
      totalPrompts
      activePrompts
      archivedPrompts
      totalVersions
      totalTestCases
      totalRuns
    }
  }
`;

export const TAB_ITEMS: TabConfigItem[] = [
  { key: "prompts", label: "Prompts", icon: Layers },
  { key: "tags", label: "Tags", icon: Tag },
  { key: "dashboard", label: "Summary", icon: GitBranch },
];

export const DEFAULT_PROMPTS_LIMIT = 10;
export const PROMPTS_SKELETON_COUNT = 4;
export const TAGS_SKELETON_COUNT = 6;
export const DASHBOARD_SKELETON_COUNT = 6;

export const PAGE_TITLE = "GraphQL Explorer";
export const PAGE_DESCRIPTION =
  "Read-only data loaded via POST /api/graphql (GraphQL Yoga). Demonstrates intentional GraphQL usage for flexible field selection.";
export const BADGE_LABEL = "GraphQL Yoga";
export const REFRESH_LABEL = "Refresh";
export const QUERY_PANEL_LABEL = "GraphQL query ▸";
export const UNKNOWN_ERROR_MESSAGE = "Unknown error";
export const QUERY_ERROR_PREFIX = "GraphQL query failed:";
