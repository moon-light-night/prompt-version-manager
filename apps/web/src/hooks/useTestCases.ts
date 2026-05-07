import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import type { CreateTestCaseInput, UpdateTestCaseInput } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";
import type { PromptTestCase } from "@pvm/shared";

export const useTestCases = (promptId: string, includeArchived = false) => {
  return useQuery<PromptTestCase[]>({
    queryKey: queryKeys.testCases.list(promptId),
    queryFn: () => trpcClient.testCase.listByPrompt.query({ promptId, includeArchived }),
    enabled: !!promptId,
  });
};

export const useTestCase = (id: string | null | undefined) => {
  return useQuery<PromptTestCase>({
    queryKey: queryKeys.testCases.detail(id ?? ""),
    queryFn: () => trpcClient.testCase.byId.query({ id: id! }),
    enabled: !!id,
  });
};

export const useCreateTestCase = (promptId: string) => {
  const qc = useQueryClient();
  return useMutation<PromptTestCase, Error, CreateTestCaseInput>({
    mutationFn: (data) => trpcClient.testCase.create.mutate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.testCases.list(promptId) });
    },
  });
};

export const useUpdateTestCase = (promptId: string) => {
  const qc = useQueryClient();
  return useMutation<PromptTestCase, Error, UpdateTestCaseInput>({
    mutationFn: (data) => trpcClient.testCase.update.mutate(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.testCases.list(promptId) });
      qc.invalidateQueries({ queryKey: queryKeys.testCases.detail(vars.id) });
    },
  });
};

export const useDeleteTestCase = (promptId: string) => {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => trpcClient.testCase.delete.mutate({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.testCases.list(promptId) });
    },
  });
};
