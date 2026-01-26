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
import { Users, UserCircle, Shield, X, Plus } from "lucide-react";

export function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { data: group } = useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => api.groups.get(groupId),
    enabled: !!groupId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => api.memberships.getGroupMembers(groupId),
    enabled: !!groupId,
  });

  const { data: allUsers } = useQuery({
    queryKey: ["users", { pageSize: 100 }],
    queryFn: () => api.users.list({ pageSize: 100 }),
  });

  const { data: allRoles } = useQuery({
    queryKey: ["roles", { pageSize: 100 }],
    queryFn: () => api.roles.list({ pageSize: 100 }),
  });

  const addUserMutation = useMutation({
    mutationFn: (userId: number) =>
      api.memberships.addUserToGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      setSelectedUserId(null);
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: number) =>
      api.memberships.removeUserFromGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: (roleId: number) =>
      api.memberships.addRoleToGroup(groupId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
      setSelectedRoleId(null);
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: number) =>
      api.memberships.removeRoleFromGroup(groupId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });

  // Filter out already added users and roles
  const availableUsers = allUsers?.results.filter(
    (user) => !members?.users.some((m) => m.id === user.id)
  ) ?? [];

  const availableRoles = allRoles?.results.filter(
    (role) => !members?.roles.some((m) => m.id === role.id)
  ) ?? [];

  if (!group) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Users Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <h2 className="font-semibold">Users</h2>
              <span className="text-sm text-muted-foreground">
                ({members?.users.length ?? 0})
              </span>
            </div>
          </div>

          {/* Add User */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Add User</Label>
              <Select
                value={selectedUserId?.toString() ?? ""}
                onValueChange={(v) => setSelectedUserId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              onClick={() => selectedUserId && addUserMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addUserMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* User List */}
          <div className="space-y-2">
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : members?.users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users in this group</p>
            ) : (
              members?.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-secondary rounded"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => removeUserMutation.mutate(user.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h2 className="font-semibold">Roles</h2>
              <span className="text-sm text-muted-foreground">
                ({members?.roles.length ?? 0})
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
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : members?.roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned to this group</p>
            ) : (
              members?.roles.map((role) => (
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
      </div>
    </div>
  );
}
