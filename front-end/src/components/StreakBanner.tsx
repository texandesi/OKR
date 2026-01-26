import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { cn } from "@/lib/utils";
import { Flame, Trophy, Calendar } from "lucide-react";

interface StreakBannerProps {
  groupId: number;
  className?: string;
}

export function StreakBanner({ groupId, className }: StreakBannerProps) {
  const { data: streak, isLoading } = useQuery({
    queryKey: ["streak", groupId],
    queryFn: () => api.streaks.get(groupId),
  });

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl bg-muted/50 p-4 animate-pulse",
          className
        )}
      >
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-32 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!streak) return null;

  const hasStreak = streak.currentStreak > 0;
  const isHotStreak = streak.currentStreak >= 7;
  const isNewRecord = streak.currentStreak === streak.longestStreak && hasStreak;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 transition-all",
        hasStreak
          ? isHotStreak
            ? "bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 border border-orange-500/30"
            : "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
          : "bg-muted/50 border border-muted",
        className
      )}
    >
      {/* Animated flame effect for hot streaks */}
      {isHotStreak && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent animate-pulse" />
      )}

      <div className="relative flex items-center gap-4">
        {/* Streak icon */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            hasStreak
              ? isHotStreak
                ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                : "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {hasStreak ? (
            <Flame
              className={cn(
                "h-6 w-6",
                isHotStreak && "animate-bounce"
              )}
            />
          ) : (
            <Calendar className="h-6 w-6" />
          )}
        </div>

        {/* Streak info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-2xl font-bold",
                hasStreak
                  ? isHotStreak
                    ? "text-orange-500"
                    : "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {hasStreak ? `${streak.currentStreak}-day streak!` : "No streak yet"}
            </span>
            {isNewRecord && hasStreak && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-600">
                <Trophy className="h-3 w-3" />
                Record!
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {hasStreak ? (
              streak.isActiveToday ? (
                "Keep the momentum going tomorrow!"
              ) : (
                "Complete a task today to keep your streak alive!"
              )
            ) : (
              "Complete a task to start your streak"
            )}
          </p>
        </div>

        {/* Best streak */}
        {streak.longestStreak > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Best</p>
            <p className="text-lg font-semibold">{streak.longestStreak} days</p>
          </div>
        )}
      </div>
    </div>
  );
}
