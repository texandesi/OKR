import { CircularProgress } from "@/components/ui/CircularProgress";
import { cn } from "@/lib/utils";

interface OverallProgressCardProps {
  overallProgress: number;
  onTrack: number;
  atRisk: number;
  behind: number;
  className?: string;
}

export function OverallProgressCard({
  overallProgress,
  onTrack,
  atRisk,
  behind,
  className,
}: OverallProgressCardProps) {
  const total = onTrack + atRisk + behind;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-8 shadow-warm-md",
        className
      )}
    >
      {/* Background gradient decoration */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-2">
        {/* Progress Circle Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <CircularProgress
            value={overallProgress}
            size={180}
            strokeWidth={12}
            colorScheme="status"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Overall Progress
            </h3>
            <p className="text-sm text-muted-foreground">
              Across all key results
            </p>
          </div>
        </div>

        {/* Status Indicators Section */}
        <div className="flex flex-col justify-center space-y-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Status Summary
          </h3>

          {/* On Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="font-medium">On Track</span>
              </div>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {onTrack} / {total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all duration-700"
                style={{
                  width: total > 0 ? `${(onTrack / total) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* At Risk */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="font-medium">At Risk</span>
              </div>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {atRisk} / {total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-warning transition-all duration-700"
                style={{
                  width: total > 0 ? `${(atRisk / total) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* Behind */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="font-medium">Behind</span>
              </div>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {behind} / {total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-destructive transition-all duration-700"
                style={{
                  width: total > 0 ? `${(behind / total) * 100}%` : "0%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
