export interface TestCaseInputValueField {
  key: string;
  value: string;
}

export const recordToFields = (record: Record<string, string>): TestCaseInputValueField[] =>
  Object.entries(record).map(([key, value]) => ({ key, value }));

export const fieldsToRecord = (fields: TestCaseInputValueField[]): Record<string, string> =>
  Object.fromEntries(fields.map((field) => [field.key, field.value]));
