import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Target, KeyRound, BarChart3, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { OverallProgressCard } from "@/components/OverallProgressCard";
import type { KeyResult } from "@/types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Dashboard() {
  const { data: objectives, isLoading: objectivesLoading } = useQuery({
    queryKey: ["objectives", { pageSize: 100 }],
    queryFn: () => api.objectives.list({ pageSize: 100 }),
  });

  const { data: keyresults, isLoading: keyresultsLoading } = useQuery({
    queryKey: ["keyresults", { pageSize: 100 }],
    queryFn: () => api.keyresults.list({ pageSize: 100 }),
  });

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["kpis", { pageSize: 1 }],
    queryFn: () => api.kpis.list({ pageSize: 1 }),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users", { pageSize: 1 }],
    queryFn: () => api.users.list({ pageSize: 1 }),
  });

  const isLoading = objectivesLoading || keyresultsLoading || kpisLoading || usersLoading;

  // Calculate progress metrics from key results
  const keyResultsList: KeyResult[] = keyresults?.results ?? [];
  const overallProgress =
    keyResultsList.length > 0
      ? Math.round(
          keyResultsList.reduce((sum, kr) => sum + (kr.progressPercentage || 0), 0) /
            keyResultsList.length
        )
      : 0;

  // Categorize key results by status
  const onTrack = keyResultsList.filter((kr) => (kr.progressPercentage || 0) >= 70).length;
  const atRisk = keyResultsList.filter(
    (kr) => (kr.progressPercentage || 0) >= 40 && (kr.progressPercentage || 0) < 70
  ).length;
  const behind = keyResultsList.filter((kr) => (kr.progressPercentage || 0) < 40).length;

  const stats = [
    {
      label: "Objectives",
      value: objectives?.count ?? 0,
      icon: Target,
      variant: "primary" as const,
    },
    {
      label: "Key Results",
      value: keyresults?.count ?? 0,
      icon: KeyRound,
      variant: "primary" as const,
    },
    {
      label: "KPIs",
      value: kpis?.count ?? 0,
      icon: BarChart3,
      variant: "accent" as const,
    },
    {
      label: "Team Members",
      value: users?.count ?? 0,
      icon: Users,
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Header */}
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">{getFormattedDate()}</p>
        <h1 className="text-3xl font-display font-semibold tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your organization's OKR progress
        </p>
      </header>

      {/* Overall Progress Hero */}
      {!isLoading && keyResultsList.length > 0 && (
        <OverallProgressCard
          overallProgress={overallProgress}
          onTrack={onTrack}
          atRisk={atRisk}
          behind={behind}
          className="animate-fade-in-up"
        />
      )}

      {/* Loading State for Progress Card */}
      {isLoading && (
        <div className="rounded-2xl border bg-card p-8 shadow-warm-md">
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      )}

      {/* Empty State for No Key Results */}
      {!isLoading && keyResultsList.length === 0 && (
        <div className="rounded-2xl border bg-card p-8 shadow-warm-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Key Results Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create objectives and key results to start tracking your progress.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={isLoading ? "..." : stat.value}
              icon={stat.icon}
              variant={stat.variant}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions / Tips Section */}
      <section className="rounded-xl border bg-card p-6 shadow-warm">
        <h2 className="mb-4 font-semibold">Getting Started</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span className="font-display font-bold text-primary">1</span>
            </div>
            <h3 className="font-medium">Define Objectives</h3>
            <p className="text-sm text-muted-foreground">
              Set clear, ambitious goals that align with your organization's vision.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span className="font-display font-bold text-primary">2</span>
            </div>
            <h3 className="font-medium">Add Key Results</h3>
            <p className="text-sm text-muted-foreground">
              Create measurable outcomes that indicate objective achievement.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <span className="font-display font-bold text-primary">3</span>
            </div>
            <h3 className="font-medium">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Regularly update progress and review status in your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
