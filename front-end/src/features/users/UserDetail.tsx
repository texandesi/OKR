import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCircle, Users, Shield, X, Plus } from "lucide-react";

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const queryClient = useQueryClient();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { data: user } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => api.users.get(userId),
    enabled: !!userId,
  });

  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["userMemberships", userId],
    queryFn: () => api.memberships.getUserMemberships(userId),
    enabled: !!userId,
  });

  const { data: allRoles } = useQuery({
    queryKey: ["roles", { pageSize: 100 }],
    queryFn: () => api.roles.list({ pageSize: 100 }),
  });

  const addRoleMutation = useMutation({
    mutationFn: (roleId: number) =>
      api.memberships.addRoleToUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMemberships", userId] });
      setSelectedRoleId(null);
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: number) =>
      api.memberships.removeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMemberships", userId] });
    },
  });

  // Filter out already assigned roles
  const availableRoles = allRoles?.results.filter(
    (role) => !memberships?.roles.some((m) => m.id === role.id)
  ) ?? [];

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Roles Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h2 className="font-semibold">Roles</h2>
              <span className="text-sm text-muted-foreground">
                ({memberships?.roles.length ?? 0})
              </span>
            </div>
          </div>

          {/* Add Role */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Add Role</Label>
              <Select
                value={selectedRoleId?.toString() ?? ""}
                onValueChange={(v) => setSelectedRoleId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              onClick={() => selectedRoleId && addRoleMutation.mutate(selectedRoleId)}
              disabled={!selectedRoleId || addRoleMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Role List */}
          <div className="space-y-2">
            {membershipsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : memberships?.roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            ) : (
              memberships?.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-2 bg-secondary rounded"
                >
                  <span>{role.name}</span>
                  <button
                    onClick={() => removeRoleMutation.mutate(role.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Groups Section (Read Only) */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="font-semibold">Groups</h2>
              <span className="text-sm text-muted-foreground">
                ({memberships?.groups.length ?? 0})
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Groups are managed from the Group detail page
          </p>

          {/* Group List */}
          <div className="space-y-2">
            {membershipsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : memberships?.groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not a member of any groups</p>
            ) : (
              memberships?.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-2 bg-secondary rounded"
                >
                  <span>{group.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
