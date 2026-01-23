import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  variant?: "default" | "primary" | "accent";
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
  style,
}: StatCardProps) {
  const bgStyles = {
    default: "bg-card",
    primary: "bg-primary/5",
    accent: "bg-accent/5",
  };

  const iconBgStyles = {
    default: "bg-muted",
    primary: "bg-primary/10",
    accent: "bg-accent/10",
  };

  const iconColorStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 shadow-warm transition-all duration-300 hover:shadow-warm-md hover:-translate-y-0.5",
        bgStyles[variant],
        className
      )}
      style={style}
    >
      {/* Decorative blur circle */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-70",
          variant === "primary" && "bg-primary/20",
          variant === "accent" && "bg-accent/20",
          variant === "default" && "bg-muted"
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold font-mono tabular-nums tracking-tight">
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-destructive",
                trend.direction === "neutral" && "text-muted-foreground"
              )}
            >
              {trend.direction === "up" && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              )}
              {trend.direction === "down" && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              )}
              <span>
                {trend.direction !== "neutral" && `${Math.abs(trend.value)}%`}
                {trend.direction === "neutral" && "No change"}
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            iconBgStyles[variant]
          )}
        >
          <Icon className={cn("h-6 w-6", iconColorStyles[variant])} />
        </div>
      </div>
    </div>
  );
}
