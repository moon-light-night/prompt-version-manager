import Link from "next/link";
import { FlaskConical, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEST_CASES_LABEL, VERSION_HISTORY_LABEL } from "./prompt-detail.constants";

interface PromptQuickNavigationProps {
  promptId: string;
  testCaseCount: number;
}

export const PromptQuickNavigation = ({ promptId, testCaseCount }: PromptQuickNavigationProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/prompts/${promptId}/versions`}>
          <GitBranch className="h-4 w-4 mr-1" />
          {VERSION_HISTORY_LABEL}
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/prompts/${promptId}/test-cases`}>
          <FlaskConical className="h-4 w-4 mr-1" />
          {TEST_CASES_LABEL}
          {testCaseCount > 0 && (
            <span className="ml-1.5 text-xs rounded-full bg-primary/10 text-primary px-1.5 py-0.5">
              {testCaseCount}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
};
