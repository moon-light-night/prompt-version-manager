import { z } from "zod";

const REQUIRED_NAME_MESSAGE = "Name is required";
const NAME_MAX_LENGTH = 255;
const NAME_TOO_LONG_MESSAGE = `Name must be at most ${NAME_MAX_LENGTH} characters`;
const REQUIRED_VARIABLE_NAME_MESSAGE = "Variable name is required";
const DUPLICATE_VARIABLE_NAME_MESSAGE = "Duplicate variable name";

export const testCaseFormSchema = z.object({
  name: z
    .string()
    .min(1, REQUIRED_NAME_MESSAGE)
    .max(NAME_MAX_LENGTH, NAME_TOO_LONG_MESSAGE),
  inputValues: z
    .array(
      z.object({
        key: z.string().min(1, REQUIRED_VARIABLE_NAME_MESSAGE),
        value: z.string(),
      }),
    )
    .superRefine((items, ctx) => {
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (!item.key) {
          return;
        }
        if (seen.has(item.key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: DUPLICATE_VARIABLE_NAME_MESSAGE,
            path: [index, "key"],
          });
        }
        seen.add(item.key);
      });
    }),
  expectedOutput: z.string().optional(),
});

export type TestCaseFormValues = z.infer<typeof testCaseFormSchema>;
