import { QUERY_PANEL_LABEL } from "./graphql-explorer.constants";

interface GraphQLQueryPanelProps {
  query: string;
}

export const GraphQLQueryPanel = ({ query }: GraphQLQueryPanelProps) => {
  return (
    <details className="rounded-lg border border-border bg-muted/30">
      <summary className="cursor-pointer px-4 py-2 text-xs font-mono text-muted-foreground hover:text-foreground select-none">
        {QUERY_PANEL_LABEL}
      </summary>
      <pre className="px-4 pb-3 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
        {query.trim()}
      </pre>
    </details>
  );
};
