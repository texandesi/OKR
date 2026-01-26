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
import { RelationshipSelector } from "@/components/RelationshipSelector";
import { Plus, Users, Shield, Building2 } from "lucide-react";
import { usersHooks, organizationsHooks, groupsHooks, rolesHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { User, UserCreate } from "@/types";

const columns: Column<User>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description" },
  {
    key: "organizations",
    label: "Organizations",
    render: (item: User) => (
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
    key: "groups",
    label: "Groups",
    render: (item: User) => (
      <div className="flex flex-wrap gap-1">
        {item.groups && item.groups.length > 0 ? (
          item.groups.map((group) => (
            <Badge key={group.id} variant="group" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {group.name}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </div>
    ),
  },
  {
    key: "roles",
    label: "Roles",
    render: (item: User) => (
      <div className="flex flex-wrap gap-1">
        {item.roles && item.roles.length > 0 ? (
          item.roles.map((role) => (
            <Badge key={role.id} variant="role" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {role.name}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        )}
      </div>
    ),
  },
];

export function UsersList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserCreate>({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Relationship state
  const [selectedOrgIds, setSelectedOrgIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [originalOrgIds, setOriginalOrgIds] = useState<number[]>([]);
  const [originalGroupIds, setOriginalGroupIds] = useState<number[]>([]);
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([]);

  const { data, isLoading, refetch } = usersHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  // Fetch all available entities for selection
  const { data: orgsData } = organizationsHooks.useList({ pageSize: 100 });
  const { data: groupsData } = groupsHooks.useList({ pageSize: 100 });
  const { data: rolesData } = rolesHooks.useList({ pageSize: 100 });

  const createMutation = usersHooks.useCreate();
  const updateMutation = usersHooks.useUpdate();
  const deleteMutation = usersHooks.useDelete();

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleOpenDialog = (item?: User) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description });
      const orgIds = item.organizations?.map((o) => o.id) ?? [];
      const groupIds = item.groups?.map((g) => g.id) ?? [];
      const roleIds = item.roles?.map((r) => r.id) ?? [];
      setSelectedOrgIds(orgIds);
      setSelectedGroupIds(groupIds);
      setSelectedRoleIds(roleIds);
      setOriginalOrgIds(orgIds);
      setOriginalGroupIds(groupIds);
      setOriginalRoleIds(roleIds);
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
      setSelectedOrgIds([]);
      setSelectedGroupIds([]);
      setSelectedRoleIds([]);
      setOriginalOrgIds([]);
      setOriginalGroupIds([]);
      setOriginalRoleIds([]);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let userId: number;

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
        userId = editingItem.id;
      } else {
        const newUser = await createMutation.mutateAsync(formData);
        userId = newUser.id;
      }

      // Handle organization membership changes
      const addedOrgs = selectedOrgIds.filter((id) => !originalOrgIds.includes(id));
      const removedOrgs = originalOrgIds.filter((id) => !selectedOrgIds.includes(id));
      for (const orgId of addedOrgs) {
        await api.memberships.addUserToOrganization(orgId, userId);
      }
      for (const orgId of removedOrgs) {
        await api.memberships.removeUserFromOrganization(orgId, userId);
      }

      // Handle group membership changes
      const addedGroups = selectedGroupIds.filter((id) => !originalGroupIds.includes(id));
      const removedGroups = originalGroupIds.filter((id) => !selectedGroupIds.includes(id));
      for (const groupId of addedGroups) {
        await api.memberships.addUserToGroup(groupId, userId);
      }
      for (const groupId of removedGroups) {
        await api.memberships.removeUserFromGroup(groupId, userId);
      }

      // Handle role assignment changes
      const addedRoles = selectedRoleIds.filter((id) => !originalRoleIds.includes(id));
      const removedRoles = originalRoleIds.filter((id) => !selectedRoleIds.includes(id));
      for (const roleId of addedRoles) {
        await api.memberships.addRoleToUser(userId, roleId);
      }
      for (const roleId of removedRoles) {
        await api.memberships.removeRoleFromUser(userId, roleId);
      }

      await refetch();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: User) => {
    if (confirm(`Delete "${item.name}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
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
              {editingItem ? "Edit User" : "Add User"}
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
                  label="Groups"
                  availableItems={groupsData?.results ?? []}
                  selectedIds={selectedGroupIds}
                  onChange={setSelectedGroupIds}
                  variant="group"
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
