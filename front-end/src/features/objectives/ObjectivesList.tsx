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
import { objectivesHooks } from "@/hooks/useApi";
import type { Objective, ObjectiveCreate } from "@/types";
import { Plus } from "lucide-react";

const columns: Column<Objective>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description" },
];

export function ObjectivesList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Objective | null>(null);
  const [formData, setFormData] = useState<ObjectiveCreate>({ name: "", description: "" });

  const { data, isLoading } = objectivesHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  const createMutation = objectivesHooks.useCreate();
  const updateMutation = objectivesHooks.useUpdate();
  const deleteMutation = objectivesHooks.useDelete();

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleOpenDialog = (item?: Objective) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (item: Objective) => {
    if (confirm(`Delete objective "${item.name}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Objectives</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Objective" : "Add Objective"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter objective name"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
