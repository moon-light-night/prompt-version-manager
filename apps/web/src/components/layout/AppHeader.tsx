"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title?: string;
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  const dispatch = useAppDispatch();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="flex items-center h-14 px-4 border-b border-border bg-background shrink-0">
      <button
        className="md:hidden mr-3 p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {title && (
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      )}

      <div className="ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Light theme" : "Dark theme"}
        >
          {!mounted ? (
            <Sun className="h-4 w-4" />
          ) : isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
};
