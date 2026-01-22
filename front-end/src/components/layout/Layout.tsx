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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/objectives", label: "Objectives", icon: Target },
  { path: "/keyresults", label: "Key Results", icon: KeyRound },
  { path: "/kpis", label: "KPIs", icon: BarChart3 },
  { path: "/users", label: "Users", icon: Users },
  { path: "/roles", label: "Roles", icon: Shield },
  { path: "/groups", label: "Groups", icon: UserCog },
  { path: "/organizations", label: "Organizations", icon: Building2 },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">OKR Manager</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b flex items-center px-6">
          <h2 className="text-lg font-semibold">
            {navItems.find((item) => item.path === location.pathname)?.label || "OKR Manager"}
          </h2>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
