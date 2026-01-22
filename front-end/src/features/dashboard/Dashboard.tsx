import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Target, KeyRound, BarChart3, Users } from "lucide-react";

export function Dashboard() {
  const { data: objectives } = useQuery({
    queryKey: ["objectives", { pageSize: 1 }],
    queryFn: () => api.objectives.list({ pageSize: 1 }),
  });

  const { data: keyresults } = useQuery({
    queryKey: ["keyresults", { pageSize: 1 }],
    queryFn: () => api.keyresults.list({ pageSize: 1 }),
  });

  const { data: kpis } = useQuery({
    queryKey: ["kpis", { pageSize: 1 }],
    queryFn: () => api.kpis.list({ pageSize: 1 }),
  });

  const { data: users } = useQuery({
    queryKey: ["users", { pageSize: 1 }],
    queryFn: () => api.users.list({ pageSize: 1 }),
  });

  const stats = [
    { label: "Objectives", value: objectives?.count ?? 0, icon: Target, color: "bg-blue-500" },
    { label: "Key Results", value: keyresults?.count ?? 0, icon: KeyRound, color: "bg-green-500" },
    { label: "KPIs", value: kpis?.count ?? 0, icon: BarChart3, color: "bg-purple-500" },
    { label: "Users", value: users?.count ?? 0, icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome to OKR Manager</h2>
        <p className="text-muted-foreground">
          Manage your Objectives and Key Results to track progress toward your goals.
          Use the sidebar to navigate between different sections.
        </p>
      </div>
    </div>
  );
}
