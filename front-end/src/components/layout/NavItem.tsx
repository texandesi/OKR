import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isCollapsed?: boolean;
}

export function NavItem({ path, label, icon: Icon, isActive, isCollapsed }: NavItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-transform",
          !isActive && "group-hover:scale-110"
        )}
      />
      {!isCollapsed && (
        <span className="animate-fade-in truncate">{label}</span>
      )}
    </Link>
  );
}
