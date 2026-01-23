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
import { Building2, UserCircle, Users, X, Plus } from "lucide-react";

export function OrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const organizationId = Number(id);
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const { data: organization } = useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: () => api.organizations.get(organizationId),
    enabled: !!organizationId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["organizationMembers", organizationId],
    queryFn: () => api.memberships.getOrganizationMembers(organizationId),
    enabled: !!organizationId,
  });

  const { data: allUsers } = useQuery({
    queryKey: ["users", { pageSize: 100 }],
    queryFn: () => api.users.list({ pageSize: 100 }),
  });

  const { data: allGroups } = useQuery({
    queryKey: ["groups", { pageSize: 100 }],
    queryFn: () => api.groups.list({ pageSize: 100 }),
  });

  const addUserMutation = useMutation({
    mutationFn: (userId: number) =>
      api.memberships.addUserToOrganization(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationMembers", organizationId] });
      setSelectedUserId(null);
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId: number) =>
      api.memberships.removeUserFromOrganization(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationMembers", organizationId] });
    },
  });

  const addGroupMutation = useMutation({
    mutationFn: (groupId: number) =>
      api.memberships.addGroupToOrganization(organizationId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationMembers", organizationId] });
      setSelectedGroupId(null);
    },
  });

  const removeGroupMutation = useMutation({
    mutationFn: (groupId: number) =>
      api.memberships.removeGroupFromOrganization(organizationId, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizationMembers", organizationId] });
    },
  });

  // Filter out already added users and groups
  const availableUsers = allUsers?.results.filter(
    (user) => !members?.users.some((m) => m.id === user.id)
  ) ?? [];

  const availableGroups = allGroups?.results.filter(
    (group) => !members?.groups.some((m) => m.id === group.id)
  ) ?? [];

  if (!organization) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">{organization.description}</p>
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
              <p className="text-sm text-muted-foreground">No users in this organization</p>
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

        {/* Groups Section */}
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="font-semibold">Groups</h2>
              <span className="text-sm text-muted-foreground">
                ({members?.groups.length ?? 0})
              </span>
            </div>
          </div>

          {/* Add Group */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Add Group</Label>
              <Select
                value={selectedGroupId?.toString() ?? ""}
                onValueChange={(v) => setSelectedGroupId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              onClick={() => selectedGroupId && addGroupMutation.mutate(selectedGroupId)}
              disabled={!selectedGroupId || addGroupMutation.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Group List */}
          <div className="space-y-2">
            {membersLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : members?.groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No groups in this organization</p>
            ) : (
              members?.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-2 bg-secondary rounded"
                >
                  <span>{group.name}</span>
                  <button
                    onClick={() => removeGroupMutation.mutate(group.id)}
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
