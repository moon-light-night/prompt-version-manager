import { cn } from "@/lib/utils";
import type { DiffResult, DiffLine, DiffLineType } from "@pvm/shared";

interface DiffViewerProps {
  diff: DiffResult;
  className?: string;
}

const lineColors: Record<DiffLineType, string> = {
  added: "bg-green-50 border-l-4 border-green-400 text-green-900",
  removed: "bg-red-50 border-l-4 border-red-400 text-red-900 line-through",
  unchanged: "bg-white text-gray-700",
};

const linePrefixes: Record<DiffLineType, string> = {
  added: "+ ",
  removed: "- ",
  unchanged: "  ",
};

const DiffLineRow = ({ line }: { line: DiffLine }) => {
  return (
    <div
      className={cn(
        "flex gap-2 px-3 py-0.5 font-mono text-sm leading-relaxed",
        lineColors[line.type],
      )}
      data-line-type={line.type}
    >
      <span className="select-none w-4 shrink-0 text-gray-400 text-xs pt-0.5">
        {line.lineNumber ?? ""}
      </span>
      <span className="whitespace-pre-wrap break-all">
        <span className="select-none opacity-60">{linePrefixes[line.type]}</span>
        {line.content}
      </span>
    </div>
  );
};

export const DiffViewer = ({ diff, className }: DiffViewerProps) => {
  const isEmpty = diff.lines.length === 0;

  return (
    <div
      data-testid="diff-viewer"
      className={cn(
        "rounded-lg border border-border overflow-hidden text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-4 px-4 py-2 bg-muted border-b text-xs font-medium">
        <span className="text-green-600">+{diff.addedCount} added</span>
        <span className="text-red-600">−{diff.removedCount} removed</span>
        <span className="text-gray-500">{diff.unchangedCount} unchanged</span>
      </div>

      <div className="overflow-auto max-h-[28rem]">
      {diff.lines.length === 0 || (diff.addedCount === 0 && diff.removedCount === 0) ? (
          <p className="px-4 py-6 text-center text-muted-foreground text-sm">
            No changes between these versions.
          </p>
        ) : (
          diff.lines.map((line, i) => <DiffLineRow key={i} line={line} />)
        )}
      </div>
    </div>
  );
};
