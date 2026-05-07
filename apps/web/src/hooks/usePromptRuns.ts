import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import type { CreateRunInput } from "@/lib/trpc";
import { queryKeys } from "@/lib/queryKeys";
import type { PromptRun } from "@pvm/shared";

export const useRunsByPrompt = (promptId: string) => {
  return useQuery<PromptRun[]>({
    queryKey: queryKeys.promptRuns.listByPrompt(promptId),
    queryFn: () => trpcClient.promptRun.listByPrompt.query({ promptId }),
    enabled: !!promptId,
  });
};

export const useRunsByVersion = (versionId: string) => {
  return useQuery<PromptRun[]>({
    queryKey: queryKeys.promptRuns.listByVersion(versionId),
    queryFn: () => trpcClient.promptRun.listByVersion.query({ versionId }),
    enabled: !!versionId,
  });
};

export const useRunsByTestCase = (testCaseId: string) => {
  return useQuery<PromptRun[]>({
    queryKey: queryKeys.promptRuns.listByTestCase(testCaseId),
    queryFn: () => trpcClient.promptRun.listByTestCase.query({ testCaseId }),
    enabled: !!testCaseId,
  });
};

export const usePromptRun = (id: string | null | undefined) => {
  return useQuery<PromptRun>({
    queryKey: queryKeys.promptRuns.detail(id ?? ""),
    queryFn: () => trpcClient.promptRun.byId.query({ id: id! }),
    enabled: !!id,
  });
};

export const useCreateRun = (promptId: string, versionId?: string) => {
  const qc = useQueryClient();
  return useMutation<PromptRun, Error, CreateRunInput>({
    mutationFn: (data) => trpcClient.promptRun.create.mutate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.promptRuns.listByPrompt(promptId) });
      if (versionId) {
        qc.invalidateQueries({ queryKey: queryKeys.promptRuns.listByVersion(versionId) });
      }
    },
  });
};
