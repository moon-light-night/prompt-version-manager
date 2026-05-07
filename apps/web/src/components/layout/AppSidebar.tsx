"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, BookOpen, Settings, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSidebarOpen } from "@/store/slices/uiSlice";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Prompts",
    href: "/prompts",
    icon: Layers,
    exact: false,
  },
  {
    label: "GraphQL",
    href: "/graphql-explorer",
    icon: Code2,
    exact: false,
  },
];

const bottomNavItems = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    exact: true,
  },
  {
    label: "About",
    href: "/about",
    icon: BookOpen,
    exact: true,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const isActive = (href: string, exact: boolean) =>
    (exact ? pathname === href : pathname.startsWith(href));

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar border-r border-sidebar-border",
          "transition-transform duration-200 ease-in-out",
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
          <Link
            href="/prompts"
            className="flex items-center gap-2 font-semibold text-sidebar-foreground"
          >
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="text-sm">Prompt Manager</span>
          </Link>
          <button
            className="md:hidden p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => dispatch(setSidebarOpen(false))}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive(href, exact)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-0.5 mt-auto">
            {bottomNavItems.map(({ label, href, icon: Icon, exact }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive(href, exact)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">v0.1.0</p>
        </div>
      </aside>
    </>
  );
};
