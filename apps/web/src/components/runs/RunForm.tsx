"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/FormField";
import { Textarea } from "@/components/ui/textarea";
import { RenderedPromptPreview } from "@/components/testCases/RenderedPromptPreview";

export const runFormSchema = z.object({
  actualOutput: z.string().min(1, "Actual output is required"),
  score: z
    .number({ invalid_type_error: "Score must be a number" })
    .int()
    .min(1, "Minimum score is 1")
    .max(5, "Maximum score is 5")
    .nullish(),
  notes: z.string().max(2000, "Notes must be at most 2000 characters").optional(),
});

export type RunFormValues = z.infer<typeof runFormSchema>;

const SCORE_LABELS: Record<number, string> = {
  1: "1 – Very bad",
  2: "2 – Poor",
  3: "3 – OK",
  4: "4 – Good",
  5: "5 – Excellent",
};

interface ScoreSelectorProps {
  value: number | null | undefined;
  onChange: (v: number | null) => void;
}

const ScoreSelector = ({ value, onChange }: ScoreSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Score" data-testid="score-selector">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          onClick={() => onChange(value === s ? null : s)}
          aria-label={SCORE_LABELS[s]}
          className={[
            "h-10 w-10 rounded-full border-2 text-sm font-bold transition-colors",
            value === s
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:border-primary/60",
          ].join(" ")}
        >
          {s}
        </button>
      ))}
    </div>
  );
};

interface RunFormProps {
  promptContent?: string;
  inputValues?: Record<string, string>;
  onSubmit: (values: RunFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const RunForm = ({
  promptContent,
  inputValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save run",
}: RunFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RunFormValues>({
    resolver: zodResolver(runFormSchema),
    defaultValues: { actualOutput: "", score: null, notes: "" },
  });

  const scoreValue = watch("score");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="run-form"
      className="space-y-6"
    >
      {promptContent !== undefined && inputValues !== undefined && (
        <RenderedPromptPreview
          promptContent={promptContent}
          inputValues={inputValues}
        />
      )}

      <FormField
        label="Actual output"
        htmlFor="run-output"
        error={errors.actualOutput?.message}
        required
        hint="Paste the LLM response or write the expected output manually"
      >
        <Textarea
          id="run-output"
          {...register("actualOutput")}
          rows={8}
          placeholder="Paste the model output here…"
          className="font-mono text-sm"
        />
      </FormField>

      <FormField label="Score" htmlFor="run-score" error={errors.score?.message}>
        <ScoreSelector
          value={scoreValue}
          onChange={(v) => setValue("score", v, { shouldValidate: true })}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Rate the quality from 1 (very bad) to 5 (excellent). Optional.
        </p>
      </FormField>

      <FormField
        label="Notes"
        htmlFor="run-notes"
        error={errors.notes?.message}
        hint="Optional reviewer observations"
      >
        <Textarea
          id="run-notes"
          {...register("notes")}
          rows={3}
          placeholder="Any observations about this output…"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
};
