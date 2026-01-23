import { useState } from "react";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RelationshipSelector } from "@/components/RelationshipSelector";
import { Plus, User, Shield, Building2, GitBranch, Crown } from "lucide-react";
import { groupsHooks, usersHooks, rolesHooks, organizationsHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { Group, GroupCreate } from "@/types";

const columns: Column<Group>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  {
    key: "parent",
    label: "Parent / Owner",
    render: (item: Group) => (
      <div className="flex flex-col gap-1">
        {item.parent ? (
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <GitBranch className="h-3 w-3" />
            {item.parent.name}
          </Badge>
        ) : null}
        {item.owner ? (
          <Badge variant="user" className="flex items-center gap-1 w-fit">
            <Crown className="h-3 w-3" />
            {item.owner.name}
          </Badge>
        ) : null}
        {!item.parent && !item.owner && (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </div>
    ),
  },
  {
    key: "organizations",
    label: "Organizations",
    render: (item: Group) => (
      <div className="flex flex-wrap gap-1">
        {item.organizations && item.organizations.length > 0 ? (
          item.organizations.map((org) => (
            <Badge key={org.id} variant="organization" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {org.name}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </div>
    ),
  },
  {
    key: "users",
    label: "Members",
    render: (item: Group) => (
      <div className="flex flex-wrap gap-1">
        {item.users && item.users.length > 0 ? (
          item.users.length <= 2 ? (
            item.users.map((user) => (
              <Badge key={user.id} variant="user" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {user.name}
              </Badge>
            ))
          ) : (
            <Badge variant="user" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.users.length} members
            </Badge>
          )
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </div>
    ),
  },
  {
    key: "roles",
    label: "Roles",
    render: (item: Group) => (
      <div className="flex flex-wrap gap-1">
        {item.roles && item.roles.length > 0 ? (
          item.roles.length <= 2 ? (
            item.roles.map((role) => (
              <Badge key={role.id} variant="role" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {role.name}
              </Badge>
            ))
          ) : (
            <Badge variant="role" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {item.roles.length} roles
            </Badge>
          )
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </div>
    ),
  },
];

export function GroupsList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Group | null>(null);
  const [formData, setFormData] = useState<GroupCreate>({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Relationship state
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState<number[]>([]);
  const [parentId, setParentId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [originalUserIds, setOriginalUserIds] = useState<number[]>([]);
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([]);
  const [originalOrgIds, setOriginalOrgIds] = useState<number[]>([]);

  const { data, isLoading, refetch } = groupsHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  // Fetch all available entities for selection
  const { data: usersData } = usersHooks.useList({ pageSize: 100 });
  const { data: rolesData } = rolesHooks.useList({ pageSize: 100 });
  const { data: orgsData } = organizationsHooks.useList({ pageSize: 100 });

  const createMutation = groupsHooks.useCreate();
  const updateMutation = groupsHooks.useUpdate();
  const deleteMutation = groupsHooks.useDelete();

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Filter out the current group from parent options to prevent self-reference
  const availableParentGroups = (data?.results ?? []).filter(
    (g) => g.id !== editingItem?.id
  );

  const handleOpenDialog = (item?: Group) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description });
      const userIds = item.users?.map((u) => u.id) ?? [];
      const roleIds = item.roles?.map((r) => r.id) ?? [];
      const orgIds = item.organizations?.map((o) => o.id) ?? [];
      setSelectedUserIds(userIds);
      setSelectedRoleIds(roleIds);
      setSelectedOrgIds(orgIds);
      setOriginalUserIds(userIds);
      setOriginalRoleIds(roleIds);
      setOriginalOrgIds(orgIds);
      setParentId(item.parentId?.toString() ?? "");
      setOwnerId(item.ownerId?.toString() ?? "");
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
      setSelectedUserIds([]);
      setSelectedRoleIds([]);
      setSelectedOrgIds([]);
      setOriginalUserIds([]);
      setOriginalRoleIds([]);
      setOriginalOrgIds([]);
      setParentId("");
      setOwnerId("");
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const groupData: GroupCreate = {
        ...formData,
        parentId: parentId ? parseInt(parentId, 10) : null,
        ownerId: ownerId ? parseInt(ownerId, 10) : null,
      };

      let groupId: number;

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: groupData });
        groupId = editingItem.id;
      } else {
        const newGroup = await createMutation.mutateAsync(groupData);
        groupId = newGroup.id;
      }

      // Handle user membership changes
      const addedUsers = selectedUserIds.filter((id) => !originalUserIds.includes(id));
      const removedUsers = originalUserIds.filter((id) => !selectedUserIds.includes(id));
      for (const userId of addedUsers) {
        await api.memberships.addUserToGroup(groupId, userId);
      }
      for (const userId of removedUsers) {
        await api.memberships.removeUserFromGroup(groupId, userId);
      }

      // Handle role assignment changes
      const addedRoles = selectedRoleIds.filter((id) => !originalRoleIds.includes(id));
      const removedRoles = originalRoleIds.filter((id) => !selectedRoleIds.includes(id));
      for (const roleId of addedRoles) {
        await api.memberships.addRoleToGroup(groupId, roleId);
      }
      for (const roleId of removedRoles) {
        await api.memberships.removeRoleFromGroup(groupId, roleId);
      }

      // Handle organization membership changes
      const addedOrgs = selectedOrgIds.filter((id) => !originalOrgIds.includes(id));
      const removedOrgs = originalOrgIds.filter((id) => !selectedOrgIds.includes(id));
      for (const orgId of addedOrgs) {
        await api.memberships.addGroupToOrganization(orgId, groupId);
      }
      for (const orgId of removedOrgs) {
        await api.memberships.removeGroupFromOrganization(orgId, groupId);
      }

      await refetch();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: Group) => {
    if (confirm(`Delete "${item.name}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </Button>
      </div>

      <DataTable
        data={data?.results ?? []}
        columns={columns}
        totalCount={data?.count ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSort={handleSort}
        onSearch={handleSearch}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        isLoading={isLoading}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Group" : "Add Group"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parent Group</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent group..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {availableParentGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Owner</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {(usersData?.results ?? []).map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                Relationships
              </h3>
              <div className="space-y-4">
                <RelationshipSelector
                  label="Organizations"
                  availableItems={orgsData?.results ?? []}
                  selectedIds={selectedOrgIds}
                  onChange={setSelectedOrgIds}
                  variant="organization"
                />
                <RelationshipSelector
                  label="Users"
                  availableItems={usersData?.results ?? []}
                  selectedIds={selectedUserIds}
                  onChange={setSelectedUserIds}
                  variant="user"
                />
                <RelationshipSelector
                  label="Roles"
                  availableItems={rolesData?.results ?? []}
                  selectedIds={selectedRoleIds}
                  onChange={setSelectedRoleIds}
                  variant="role"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editingItem ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
