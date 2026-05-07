"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { DashboardGraphQLNote } from "./DashboardGraphQLNote";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { PAGE_DESCRIPTION, PAGE_TITLE, NEW_PROMPT_LABEL, SUMMARY_ERROR_MESSAGE } from "./dashboard.constants";
import { RecentPromptsList } from "./RecentPromptsList";
import { RecentRunsList } from "./RecentRunsList";

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboardSummary();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader
        title={PAGE_TITLE}
        description={PAGE_DESCRIPTION}
        actions={
          <Button asChild size="sm">
            <Link href="/prompts/new">
              <Plus className="h-4 w-4 mr-1" />
              {NEW_PROMPT_LABEL}
            </Link>
          </Button>
        }
      />

      {isError ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {SUMMARY_ERROR_MESSAGE}
        </div>
      ) : (
        <DashboardStatsGrid isLoading={isLoading} data={data} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentPromptsList items={data?.recentPrompts} isLoading={isLoading} />
        <RecentRunsList items={data?.recentRuns} isLoading={isLoading} />
      </div>

      <DashboardGraphQLNote />
    </div>
  );
};

export default DashboardPage;
