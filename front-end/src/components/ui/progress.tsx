import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showValue?: boolean;
  colorScheme?: "default" | "status";
  size?: "sm" | "default" | "lg";
}

function getStatusColor(percentage: number): string {
  if (percentage >= 70) return "bg-success";
  if (percentage >= 40) return "bg-warning";
  return "bg-destructive";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showValue = false, colorScheme = "default", size = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeClasses = {
      sm: "h-1.5",
      default: "h-2.5",
      lg: "h-4",
    };

    const progressColor = colorScheme === "status" ? getStatusColor(percentage) : "bg-primary";

    return (
      <div className={cn("flex items-center gap-3", showValue && "")}>
        <div
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-muted",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              progressColor
            )}
            style={{
              width: `${percentage}%`,
              transformOrigin: "left",
            }}
          />
        </div>
        {showValue && (
          <span className="min-w-[3ch] text-right text-sm font-medium tabular-nums text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
