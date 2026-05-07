export interface FormActionState {
  isSubmitting: boolean;
  isDirty?: boolean;
}

export interface KeyValueField {
  key: string;
  value: string;
}

export type FieldErrorMap = Record<string, string | undefined>;
