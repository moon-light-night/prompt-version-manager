"use client";

import { useState } from "react";
import { Code2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useGQLQuery } from "@/hooks/useGQLQuery";
import { queryKeys } from "@/lib/queryKeys";
import { DashboardTabContent } from "./DashboardTabContent";
import { GraphQLTabs } from "./GraphQLTabs";
import { PromptsTabContent } from "./PromptsTabContent";
import { TagsTabContent } from "./TagsTabContent";
import {
  BADGE_LABEL,
  DASHBOARD_QUERY,
  DEFAULT_PROMPTS_LIMIT,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  PROMPTS_QUERY,
  REFRESH_LABEL,
  TAB_ITEMS,
  TAGS_QUERY,
} from "./graphql-explorer.constants";
import type { DashboardData, PromptsData, TabKey, TagsData } from "./graphql-explorer.types";

const GraphQLExplorerPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("prompts");

  const {
    data: promptsData,
    isLoading: promptsLoading,
    isError: promptsError,
    error: promptsErrorObject,
    refetch: refetchPrompts,
  } = useGQLQuery<PromptsData>(
    queryKeys.graphql.prompts({ limit: DEFAULT_PROMPTS_LIMIT }),
    PROMPTS_QUERY,
    { limit: DEFAULT_PROMPTS_LIMIT },
    { enabled: activeTab === "prompts" },
  );

  const {
    data: tagsData,
    isLoading: tagsLoading,
    isError: tagsError,
    error: tagsErrorObject,
    refetch: refetchTags,
  } = useGQLQuery<TagsData>(
    queryKeys.graphql.tags(),
    TAGS_QUERY,
    undefined,
    { enabled: activeTab === "tags" },
  );

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErrorObject,
    refetch: refetchDashboard,
  } = useGQLQuery<DashboardData>(
    queryKeys.graphql.dashboardSummary(),
    DASHBOARD_QUERY,
    undefined,
    { enabled: activeTab === "dashboard" },
  );

  const handleRefetch = () => {
    if (activeTab === "prompts") {
      refetchPrompts();
      return;
    }
    if (activeTab === "tags") {
      refetchTags();
      return;
    }
    refetchDashboard();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-mono">
              <Code2 className="h-3 w-3 mr-1" />
              {BADGE_LABEL}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefetch}
              className="h-8 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              {REFRESH_LABEL}
            </Button>
          </div>
        }
      />

      <GraphQLTabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div>
        {activeTab === "prompts" && (
          <PromptsTabContent
            isLoading={promptsLoading}
            isError={promptsError}
            error={promptsErrorObject}
            data={promptsData}
          />
        )}

        {activeTab === "tags" && (
          <TagsTabContent
            isLoading={tagsLoading}
            isError={tagsError}
            error={tagsErrorObject}
            data={tagsData}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardTabContent
            isLoading={dashboardLoading}
            isError={dashboardError}
            error={dashboardErrorObject}
            data={dashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default GraphQLExplorerPage;
