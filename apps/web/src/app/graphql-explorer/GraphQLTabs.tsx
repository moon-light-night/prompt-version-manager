import type { TabConfigItem, TabKey } from "./graphql-explorer.types";

interface GraphQLTabsProps {
  items: TabConfigItem[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const GraphQLTabs = ({ items, activeTab, onTabChange }: GraphQLTabsProps) => {
  return (
    <div className="flex gap-1 border-b border-border">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={[
            "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === key
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          ].join(" ")}
          data-testid={`tab-${key}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
};
