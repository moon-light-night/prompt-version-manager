import type { TestCaseFormValues } from "./TestCaseForm.schema";

export interface TestCaseFormProps {
  onSubmit: (values: TestCaseFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  suggestedVariables?: string[];
  defaultValues?: Partial<TestCaseFormValues>;
}
