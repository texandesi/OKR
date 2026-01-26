import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import type { DueTodayItem, Frequency } from "@/types";

const frequencyLabels: Record<Frequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const frequencyColors: Record<Frequency, string> = {
  daily: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  weekly: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  monthly: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

interface DueTodayCardProps {
  groupId?: number;
  className?: string;
}

export function DueTodayCard({ groupId, className = "" }: DueTodayCardProps) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["recurring", "due-today", groupId],
    queryFn: () => api.recurring.getDueToday(groupId),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Due Today
        </h3>
        <div className="animate-pulse space-y-2">
          <div className="h-12 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Due Today
        </h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No recurring tasks due today
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Due Today</h3>
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
          {items.length}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item: DueTodayItem) => (
          <DueTodayItemRow key={item.keyResultId} item={item} />
        ))}
      </ul>
    </div>
  );
}

function DueTodayItemRow({ item }: { item: DueTodayItem }) {
  return (
    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${frequencyColors[item.frequency]}`}
        >
          {frequencyLabels[item.frequency]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {item.keyResultName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {item.objectiveName}
        </p>
        {item.assigneeName && (
          <p className="text-xs text-muted-foreground mt-1">
            Assigned to: <span className="font-medium">{item.assigneeName}</span>
          </p>
        )}
      </div>
    </li>
  );
}
