import React from "react";

const renderWithHighlights = (
  content: string,
  inputValues: Record<string, string>,
): React.ReactNode[] => {
  const parts = content.split(/({{[^}]+}})/g);
  return parts.map((part, i) => {
    const match = part.match(/^{{(.+)}}$/);
    if (!match) return part;
    const varName = (match[1] ?? "").trim();
    const value = inputValues[varName];
    if (value !== undefined && value !== "") return value;
    return (
      <mark
        key={i}
        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 rounded px-0.5 font-semibold not-italic"
      >
        {part}
      </mark>
    );
  });
};

interface RenderedPromptPreviewProps {
  promptContent: string;
  inputValues: Record<string, string>;
}

export const RenderedPromptPreview = ({
  promptContent,
  inputValues,
}: RenderedPromptPreviewProps) => {
  return (
    <div data-testid="rendered-prompt-preview" className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Rendered prompt</p>
      <div className="rounded-lg border border-border bg-muted p-4 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed max-h-64 overflow-auto">
        {renderWithHighlights(promptContent, inputValues)}
      </div>
    </div>
  );
};
