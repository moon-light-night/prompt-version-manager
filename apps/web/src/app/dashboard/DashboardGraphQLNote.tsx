import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRAPHQL_CARD_DESCRIPTION, GRAPHQL_CARD_TITLE, OPEN_EXPLORER_LABEL } from "./dashboard.constants";

export const DashboardGraphQLNote = () => {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{GRAPHQL_CARD_TITLE}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{GRAPHQL_CARD_DESCRIPTION}</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/graphql-explorer">
          {OPEN_EXPLORER_LABEL} <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </Button>
    </div>
  );
};
