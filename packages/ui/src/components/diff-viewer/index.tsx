import type { DiffResult, DiffLine } from "@pvm/shared";

interface DiffViewerProps {
  result: DiffResult;
  unified?: boolean;
  className?: string;
}

export function DiffViewer({
  result,
  unified = false,
  className = "",
}: DiffViewerProps) {
  if (unified) {
    return <UnifiedDiff lines={result.lines} className={className} />;
  }

  const leftLines = result.lines.filter(
    (l) => l.type === "removed" || l.type === "unchanged",
  );
  const rightLines = result.lines.filter(
    (l) => l.type === "added" || l.type === "unchanged",
  );

  return (
    <div className={`grid grid-cols-2 gap-0 font-mono text-sm ${className}`}>
      <DiffColumn lines={leftLines} side="left" />
      <DiffColumn lines={rightLines} side="right" />
    </div>
  );
}

function DiffColumn({
  lines,
  side,
}: {
  lines: DiffLine[];
  side: "left" | "right";
}) {
  return (
    <div className="overflow-x-auto border border-border rounded-md">
      <div className="px-2 py-1 text-xs font-sans font-medium bg-muted text-muted-foreground border-b border-border">
        {side === "left" ? "Before" : "After"}
      </div>
      {lines.map((line, index) => (
        <DiffLineRow key={index} line={line} />
      ))}
    </div>
  );
}

function UnifiedDiff({
  lines,
  className,
}: {
  lines: DiffLine[];
  className: string;
}) {
  return (
    <div
      className={`overflow-x-auto font-mono text-sm border border-border rounded-md ${className}`}
    >
      {lines.map((line, index) => (
        <DiffLineRow key={index} line={line} showPrefix />
      ))}
    </div>
  );
}

function DiffLineRow({
  line,
  showPrefix = false,
}: {
  line: DiffLine;
  showPrefix?: boolean;
}) {
  const colorMap: Record<string, string> = {
    added: "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300",
    removed: "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300",
    unchanged: "text-foreground",
  };

  const prefix =
    line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";

  return (
    <div
      className={`flex items-start px-3 py-0.5 whitespace-pre-wrap break-all ${colorMap[line.type] ?? ""}`}
    >
      {showPrefix && (
        <span className="mr-2 select-none opacity-60 shrink-0">{prefix}</span>
      )}
      <span>{line.content || " "}</span>
    </div>
  );
}
