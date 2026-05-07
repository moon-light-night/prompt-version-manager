export interface PromptTestCasesPageProps {
  params: { id: string };
}

export interface PromptTestCasePageProps {
  params: { id: string; tcId: string };
}

export interface RunPageInnerProps {
  promptId: string;
  tcId: string;
}
