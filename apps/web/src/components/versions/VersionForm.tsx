"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractVariables } from "@pvm/shared";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/FormField";
import { VariablePill } from "./VariablePill";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const versionFormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  label: z.string().max(200, "Label must be at most 200 characters").optional(),
});

export type VersionFormValues = z.infer<typeof versionFormSchema>;

interface VersionFormProps {
  onSubmit: (values: VersionFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<VersionFormValues>;
}

export const VersionForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save version",
  defaultValues,
}: VersionFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VersionFormValues>({
    resolver: zodResolver(versionFormSchema),
    defaultValues: {
      content: defaultValues?.content ?? "",
      label: defaultValues?.label ?? "",
    },
  });

  const contentValue = watch("content") ?? "";
  const detectedVariables = extractVariables(contentValue);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="version-form"
      className="space-y-5"
    >
      <FormField
        label="Prompt content"
        htmlFor="content"
        error={errors.content?.message}
        required
      >
        <Textarea
          id="content"
          {...register("content")}
          rows={10}
          placeholder="Write your prompt here. Use {{variable_name}} for variables."
          className="font-mono text-sm resize-y"
        />
      </FormField>

      <div data-testid="variable-preview">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Detected variables{" "}
          <span className="font-normal">({detectedVariables.length})</span>
        </p>
        {detectedVariables.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No variables detected. Use {"{{variable_name}}"} syntax.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {detectedVariables.map((v) => (
              <VariablePill key={v} name={v} />
            ))}
          </div>
        )}
      </div>

      <FormField
        label="Label (optional)"
        htmlFor="label"
        error={errors.label?.message}
        hint="e.g. 'Fixed grammar' or 'Added CoT reasoning'"
      >
        <Input
          id="label"
          {...register("label")}
          placeholder="Short description of this version"
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
