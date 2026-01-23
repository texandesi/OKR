import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable, type Column } from "@/components/DataTable";
import { DateRangePicker } from "@/components/DateRangePicker";
import { OwnershipSelector } from "@/components/OwnershipSelector";
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
import { Progress } from "@/components/ui/progress";
import { objectivesHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { Objective, ObjectiveCreate, ObjectiveOwnership } from "@/types";
import { Plus, CheckCircle2, Circle, Calendar } from "lucide-react";

const columns: Column<Objective>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description" },
  {
    key: "progressPercentage",
    label: "Progress",
    render: (item) => (
      <div className="flex items-center gap-2 min-w-[150px]">
        <Progress value={item.progressPercentage} className="flex-1" />
        <span className="text-sm text-muted-foreground w-12">
          {item.progressPercentage.toFixed(0)}%
        </span>
      </div>
    ),
  },
  {
    key: "isComplete",
    label: "Status",
    render: (item) => (
      <div className="flex items-center gap-2">
        {item.isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
        <span className={item.isComplete ? "text-green-600" : "text-muted-foreground"}>
          {item.isComplete ? "Complete" : "In Progress"}
        </span>
      </div>
    ),
  },
  {
    key: "startDate",
    label: "Dates",
    render: (item) =>
      item.startDate || item.endDate ? (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {item.startDate ?? "—"} to {item.endDate ?? "—"}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
];

export function ObjectivesList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Objective | null>(null);
  const [ownerships, setOwnerships] = useState<ObjectiveOwnership[]>([]);
  const [formData, setFormData] = useState<ObjectiveCreate>({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
  });

  const { data, isLoading } = objectivesHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  const createMutation = objectivesHooks.useCreate();
  const updateMutation = objectivesHooks.useUpdate();
  const deleteMutation = objectivesHooks.useDelete();

  const addOwnerMutation = useMutation({
    mutationFn: ({
      objectiveId,
      ownership,
    }: {
      objectiveId: number;
      ownership: { ownerType: "user" | "role" | "group"; ownerId: number };
    }) => api.ownership.addOwner(objectiveId, ownership),
    onSuccess: (newOwnership) => {
      setOwnerships((prev) => [...prev, newOwnership]);
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });

  const removeOwnerMutation = useMutation({
    mutationFn: ({
      objectiveId,
      ownerType,
      ownerId,
    }: {
      objectiveId: number;
      ownerType: "user" | "role" | "group";
      ownerId: number;
    }) => api.ownership.removeOwner(objectiveId, ownerType, ownerId),
    onSuccess: (_, { ownerType, ownerId }) => {
      setOwnerships((prev) =>
        prev.filter((o) => !(o.ownerType === ownerType && o.ownerId === ownerId))
      );
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleOpenDialog = async (item?: Objective) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
      });
      // Fetch ownerships for editing
      try {
        const owners = await api.ownership.getOwners(item.id);
        setOwnerships(owners);
      } catch {
        setOwnerships([]);
      }
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "", startDate: null, endDate: null });
      setOwnerships([]);
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

  const handleAddOwner = async (ownership: { ownerType: "user" | "role" | "group"; ownerId: number }) => {
    if (editingItem) {
      await addOwnerMutation.mutateAsync({
        objectiveId: editingItem.id,
        ownership,
      });
    }
  };

  const handleRemoveOwner = async (ownerType: "user" | "role" | "group", ownerId: number) => {
    if (editingItem) {
      await removeOwnerMutation.mutateAsync({
        objectiveId: editingItem.id,
        ownerType,
        ownerId,
      });
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
        <DialogContent className="max-w-2xl">
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

            <DateRangePicker
              startDate={formData.startDate ?? null}
              endDate={formData.endDate ?? null}
              onStartDateChange={(date) => setFormData({ ...formData, startDate: date })}
              onEndDateChange={(date) => setFormData({ ...formData, endDate: date })}
            />

            {editingItem && (
              <OwnershipSelector
                ownerships={ownerships}
                onAdd={handleAddOwner}
                onRemove={handleRemoveOwner}
              />
            )}
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
