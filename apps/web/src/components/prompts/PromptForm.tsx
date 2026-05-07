"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/FormField";

export const promptFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
});

export type PromptFormValues = z.infer<typeof promptFormSchema>;

interface PromptFormProps {
  defaultValues?: Partial<PromptFormValues>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: PromptFormValues) => void;
  onCancel?: () => void;
}

export const PromptForm = ({
  defaultValues,
  isSubmitting = false,
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: PromptFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      data-testid="prompt-form"
      noValidate
    >
      <FormField
        label="Title"
        htmlFor="prompt-title"
        error={errors.title?.message}
        required
      >
        <Input
          id="prompt-title"
          placeholder="e.g. Customer support assistant"
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "prompt-title-error" : undefined}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="prompt-description"
        error={errors.description?.message}
        hint="What is this prompt for? What problem does it solve?"
      >
        <Textarea
          id="prompt-description"
          placeholder="Optional description…"
          rows={4}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
      </FormField>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
