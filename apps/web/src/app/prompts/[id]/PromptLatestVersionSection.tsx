import Link from "next/link";
import { GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CREATE_FIRST_VERSION_LABEL,
  NO_VERSIONS_DESCRIPTION,
  NO_VERSIONS_TITLE,
  VARIABLES_LABEL,
} from "./prompt-detail.constants";
import type { PromptVersion } from "@pvm/shared";

interface PromptLatestVersionSectionProps {
  promptId: string;
  latestVersion: PromptVersion | null;
}

export const PromptLatestVersionSection = ({
  promptId,
  latestVersion,
}: PromptLatestVersionSectionProps) => {
  if (!latestVersion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[240px] rounded-lg border border-dashed border-border bg-muted/20 text-center px-6 py-10">
        <GitBranch className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">{NO_VERSIONS_TITLE}</p>
        <p className="text-xs text-muted-foreground mb-4">{NO_VERSIONS_DESCRIPTION}</p>
        <Button size="sm" asChild>
          <Link href={`/prompts/${promptId}/versions/new`}>
            <GitBranch className="h-4 w-4 mr-1" />
            {CREATE_FIRST_VERSION_LABEL}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Latest version (v{latestVersion.versionNumber})</h3>
        {latestVersion.label && (
          <span className="text-xs text-muted-foreground italic">{latestVersion.label}</span>
        )}
      </div>
      <div className="rounded-md border border-border bg-muted/40 p-4">
        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed overflow-x-auto">
          {latestVersion.content}
        </pre>
      </div>
      {latestVersion.variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground">{VARIABLES_LABEL}</span>
          {latestVersion.variables.map((variable) => (
            <span
              key={variable}
              className="rounded-md bg-accent px-2 py-0.5 text-xs font-mono text-accent-foreground"
            >
              {`{{${variable}}}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
