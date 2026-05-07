import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Settings | Prompt Version Manager",
};

const SettingsPage = () => {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Configure your preferences." />

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">LLM</h2>
          <div className="rounded-lg border border-border divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">LLM model</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aplly sprecify prompts to LLMs.
                </p>
              </div>
              <span className="text-xs text-muted-foreground italic">Coming soon</span>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">API</h2>
          <div className="rounded-lg border border-border divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">API URL</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
