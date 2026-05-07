import { Activity, FlaskConical, GitBranch, Layers, Zap } from "lucide-react";
import type { StatCardProps } from "./dashboard.types";

export const PAGE_TITLE = "Dashboard";
export const PAGE_DESCRIPTION = "Overview of your prompt workspace.";
export const NEW_PROMPT_LABEL = "New Prompt";

export const SUMMARY_ERROR_MESSAGE = "Failed to load summary. Make sure the API is running.";

export const RECENT_PROMPTS_TITLE = "Recent Prompts";
export const RECENT_RUNS_TITLE = "Recent Runs";
export const EMPTY_PROMPTS_MESSAGE = "No prompts yet.";
export const EMPTY_RUNS_MESSAGE = "No runs recorded yet.";

export const VIEW_ALL_LABEL = "View all";
export const CREATE_FIRST_PROMPT_LABEL = "Create your first prompt";

export const GRAPHQL_CARD_TITLE = "GraphQL API";
export const GRAPHQL_CARD_DESCRIPTION = "Explore read-only prompt data powered by GraphQL Yoga.";
export const OPEN_EXPLORER_LABEL = "Open Explorer";

export const LIST_SKELETON_COUNT = 4;

export const DASHBOARD_STAT_CARDS: Omit<StatCardProps, "value" | "isLoading">[] = [
  { label: "Prompts", icon: Layers, href: "/prompts" },
  { label: "Active", icon: Zap, href: "/prompts?status=active", accent: "text-green-600" },
  { label: "Archived", icon: Layers, href: "/prompts?status=archived", accent: "text-muted-foreground" },
  { label: "Versions", icon: GitBranch, accent: "text-sky-600" },
  { label: "Test Cases", icon: FlaskConical, accent: "text-violet-600" },
  { label: "Runs", icon: Activity, accent: "text-blue-600" },
];
