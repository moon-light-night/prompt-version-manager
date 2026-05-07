"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/common/FormField";
import { testCaseFormSchema, type TestCaseFormValues } from "./TestCaseForm.schema";
import type { TestCaseFormProps } from "./TestCaseForm.types";
export { recordToFields, fieldsToRecord } from "./TestCaseForm.utils";
export { testCaseFormSchema } from "./TestCaseForm.schema";
export type { TestCaseFormValues } from "./TestCaseForm.schema";

export const TestCaseForm = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save test case",
  suggestedVariables = [],
  defaultValues,
}: TestCaseFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      inputValues: defaultValues?.inputValues ?? [],
      expectedOutput: defaultValues?.expectedOutput ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputValues",
  });

  const addSuggestedVariable = (varName: string) => {
    if (!fields.find((f) => f.key === varName)) {
      append({ key: varName, value: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="test-case-form"
      className="space-y-5"
    >
      <FormField
        label="Test case name"
        htmlFor="tc-name"
        error={errors.name?.message}
        required
      >
        <Input id="tc-name" {...register("name")} placeholder="e.g. Greeting in French" />
      </FormField>

      <div>
        <p className="text-sm font-medium mb-2">
          Input values{" "}
          <span className="text-muted-foreground font-normal">
            (variable&nbsp;→&nbsp;value)
          </span>
        </p>

        {suggestedVariables.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {suggestedVariables.map((v) => {
              const already = fields.some((f) => f.key === v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => addSuggestedVariable(v)}
                  disabled={already}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono border border-violet-200 text-violet-700 bg-violet-50 disabled:opacity-40 hover:bg-violet-100 transition-colors"
                >
                  {!already && <Plus className="h-3 w-3" />}
                  {"{{"}{v}{"}}"}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-2" data-testid="input-values-list">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <Input
                {...register(`inputValues.${index}.key`)}
                placeholder="variable_name"
                className="font-mono text-sm w-1/3 shrink-0"
                aria-label={`Variable name ${index + 1}`}
              />
              <Input
                {...register(`inputValues.${index}.value`)}
                placeholder="value"
                className="text-sm flex-1"
                aria-label={`Variable value ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                aria-label="Remove variable"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => append({ key: "", value: "" })}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add variable
        </Button>
      </div>

      <FormField
        label="Expected output"
        htmlFor="tc-expected"
        error={errors.expectedOutput?.message}
        hint="Optional reference answer for comparison"
      >
        <Textarea
          id="tc-expected"
          {...register("expectedOutput")}
          rows={4}
          placeholder="The expected model output (optional)"
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
