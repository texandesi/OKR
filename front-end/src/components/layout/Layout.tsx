import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Target,
  KeyRound,
  BarChart3,
  Users,
  Shield,
  UserCog,
  Building2,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem } from "./NavItem";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

const mainNavItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/my-okrs", label: "My OKRs", icon: ClipboardList },
  { path: "/objectives", label: "Objectives", icon: Target },
  { path: "/keyresults", label: "Key Results", icon: KeyRound },
  { path: "/kpis", label: "KPIs", icon: BarChart3 },
];

const adminNavItems = [
  { path: "/users", label: "Users", icon: Users },
  { path: "/roles", label: "Roles", icon: Shield },
  { path: "/groups", label: "Groups", icon: UserCog },
  { path: "/organizations", label: "Organizations", icon: Building2 },
];

const allNavItems = [...mainNavItems, ...adminNavItems];

export function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useRealTimeUpdates();

  const currentPage = allNavItems.find((item) => item.path === location.pathname);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-72"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-display text-lg font-semibold tracking-tight animate-fade-in">
                OKR Manager
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Main
              </p>
            )}
            {mainNavItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Administration Navigation */}
          <div className="mt-6 space-y-1">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Administration
              </p>
            )}
            {isCollapsed && <div className="my-4 mx-2 border-t" />}
            {adminNavItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
              AD
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden animate-fade-in">
                <p className="truncate text-sm font-medium">Admin User</p>
                <p className="truncate text-xs text-muted-foreground">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="border-t p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              {currentPage && currentPage.path !== "/" && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-medium">{currentPage.label}</span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
