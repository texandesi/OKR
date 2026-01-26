import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Objective } from "@/types";
import { CheckCircle2, Circle, Target, Users, Shield } from "lucide-react";

function ObjectiveCard({ objective }: { objective: Objective }) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{objective.name}</h3>
        {objective.isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">{objective.description}</p>
      <div className="flex items-center gap-2">
        <Progress value={objective.progressPercentage} className="flex-1" />
        <span className="text-sm font-medium w-12">
          {objective.progressPercentage.toFixed(0)}%
        </span>
      </div>
      {(objective.startDate || objective.endDate) && (
        <p className="text-xs text-muted-foreground">
          {objective.startDate ?? "—"} to {objective.endDate ?? "—"}
        </p>
      )}
    </div>
  );
}

function ObjectiveSection({
  title,
  icon,
  objectives,
}: {
  title: string;
  icon: React.ReactNode;
  objectives: Objective[];
}) {
  if (objectives.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          ({objectives.length})
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {objectives.map((obj) => (
          <ObjectiveCard key={obj.id} objective={obj} />
        ))}
      </div>
    </div>
  );
}

export function MyOKRs() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: usersData } = useQuery({
    queryKey: ["users", { pageSize: 100 }],
    queryFn: () => api.users.list({ pageSize: 100 }),
  });

  const { data: assignedOKRs, isLoading } = useQuery({
    queryKey: ["userObjectives", selectedUserId],
    queryFn: () =>
      selectedUserId ? api.ownership.getUserObjectives(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  const totalObjectives =
    (assignedOKRs?.individual.length ?? 0) +
    Object.values(assignedOKRs?.byRole ?? {}).flat().length +
    Object.values(assignedOKRs?.byGroup ?? {}).flat().length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My OKRs</h1>
        <div className="w-64">
          <Select
            value={selectedUserId?.toString() ?? ""}
            onValueChange={(v) => setSelectedUserId(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {usersData?.results.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedUserId && (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a user to view their assigned OKRs</p>
        </div>
      )}

      {selectedUserId && isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Loading...
        </div>
      )}

      {selectedUserId && assignedOKRs && totalObjectives === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No objectives assigned to this user</p>
        </div>
      )}

      {assignedOKRs && (
        <div className="space-y-8">
          <ObjectiveSection
            title="Individual Assignments"
            icon={<Target className="h-5 w-5" />}
            objectives={assignedOKRs.individual}
          />

          {Object.entries(assignedOKRs.byRole).map(([roleName, objectives]) => (
            <ObjectiveSection
              key={`role-${roleName}`}
              title={`Via Role: ${roleName}`}
              icon={<Shield className="h-5 w-5" />}
              objectives={objectives}
            />
          ))}

          {Object.entries(assignedOKRs.byGroup).map(
            ([groupName, objectives]) => (
              <ObjectiveSection
                key={`group-${groupName}`}
                title={`Via Group: ${groupName}`}
                icon={<Users className="h-5 w-5" />}
                objectives={objectives}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
