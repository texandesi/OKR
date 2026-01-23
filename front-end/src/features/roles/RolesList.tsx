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
import { Plus, User, Users } from "lucide-react";
import { rolesHooks, usersHooks, groupsHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { Role, RoleCreate } from "@/types";

const columns: Column<Role>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description" },
  {
    key: "users",
    label: "Users with Role",
    render: (item: Role) => (
      <div className="flex flex-wrap gap-1">
        {item.users && item.users.length > 0 ? (
          item.users.length <= 3 ? (
            item.users.map((user) => (
              <Badge key={user.id} variant="user" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {user.name}
              </Badge>
            ))
          ) : (
            <>
              {item.users.slice(0, 2).map((user) => (
                <Badge key={user.id} variant="user" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {user.name}
                </Badge>
              ))}
              <Badge variant="secondary" className="flex items-center gap-1">
                +{item.users.length - 2} more
              </Badge>
            </>
          )
        ) : (
          <span className="text-muted-foreground text-sm">No users</span>
        )}
      </div>
    ),
  },
  {
    key: "groups",
    label: "Groups with Role",
    render: (item: Role) => (
      <div className="flex flex-wrap gap-1">
        {item.groups && item.groups.length > 0 ? (
          item.groups.length <= 3 ? (
            item.groups.map((group) => (
              <Badge key={group.id} variant="group" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.name}
              </Badge>
            ))
          ) : (
            <>
              {item.groups.slice(0, 2).map((group) => (
                <Badge key={group.id} variant="group" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {group.name}
                </Badge>
              ))}
              <Badge variant="secondary" className="flex items-center gap-1">
                +{item.groups.length - 2} more
              </Badge>
            </>
          )
        ) : (
          <span className="text-muted-foreground text-sm">No groups</span>
        )}
      </div>
    ),
  },
];

export function RolesList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleCreate>({ name: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Relationship state
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [originalUserIds, setOriginalUserIds] = useState<number[]>([]);
  const [originalGroupIds, setOriginalGroupIds] = useState<number[]>([]);

  const { data, isLoading, refetch } = rolesHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  // Fetch all available entities for selection
  const { data: usersData } = usersHooks.useList({ pageSize: 100 });
  const { data: groupsData } = groupsHooks.useList({ pageSize: 100 });

  const createMutation = rolesHooks.useCreate();
  const updateMutation = rolesHooks.useUpdate();
  const deleteMutation = rolesHooks.useDelete();

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleOpenDialog = (item?: Role) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description });
      const userIds = item.users?.map((u) => u.id) ?? [];
      const groupIds = item.groups?.map((g) => g.id) ?? [];
      setSelectedUserIds(userIds);
      setSelectedGroupIds(groupIds);
      setOriginalUserIds(userIds);
      setOriginalGroupIds(groupIds);
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
      setSelectedUserIds([]);
      setSelectedGroupIds([]);
      setOriginalUserIds([]);
      setOriginalGroupIds([]);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let roleId: number;

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
        roleId = editingItem.id;
      } else {
        const newRole = await createMutation.mutateAsync(formData);
        roleId = newRole.id;
      }

      // Handle user assignment changes
      const addedUsers = selectedUserIds.filter((id) => !originalUserIds.includes(id));
      const removedUsers = originalUserIds.filter((id) => !selectedUserIds.includes(id));
      for (const userId of addedUsers) {
        await api.memberships.addRoleToUser(userId, roleId);
      }
      for (const userId of removedUsers) {
        await api.memberships.removeRoleFromUser(userId, roleId);
      }

      // Handle group assignment changes
      const addedGroups = selectedGroupIds.filter((id) => !originalGroupIds.includes(id));
      const removedGroups = originalGroupIds.filter((id) => !selectedGroupIds.includes(id));
      for (const groupId of addedGroups) {
        await api.memberships.addRoleToGroup(groupId, roleId);
      }
      for (const groupId of removedGroups) {
        await api.memberships.removeRoleFromGroup(groupId, roleId);
      }

      await refetch();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: Role) => {
    if (confirm(`Delete "${item.name}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
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
              {editingItem ? "Edit Role" : "Add Role"}
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
                Assignments
              </h3>
              <div className="space-y-4">
                <RelationshipSelector
                  label="Users with this Role"
                  availableItems={usersData?.results ?? []}
                  selectedIds={selectedUserIds}
                  onChange={setSelectedUserIds}
                  variant="user"
                />
                <RelationshipSelector
                  label="Groups with this Role"
                  availableItems={groupsData?.results ?? []}
                  selectedIds={selectedGroupIds}
                  onChange={setSelectedGroupIds}
                  variant="group"
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
