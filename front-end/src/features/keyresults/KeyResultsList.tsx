import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { keyresultsHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { KeyResult, KeyResultCreate } from "@/types";
import { Plus } from "lucide-react";

const columns: Column<KeyResult>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "objectiveName", label: "Objective" },
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
    key: "currentValue",
    label: "Current / Target",
    render: (item) => (
      <span>
        {item.currentValue ?? 0} / {item.targetValue ?? 100} {item.unit}
      </span>
    ),
  },
];

export function KeyResultsList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KeyResult | null>(null);
  const [formData, setFormData] = useState<KeyResultCreate>({
    name: "",
    description: "",
    objective: 0,
    targetValue: 100,
    currentValue: 0,
    unit: "%",
  });

  const { data, isLoading } = keyresultsHooks.useList({
    page,
    pageSize,
    ordering: sortDirection === "desc" ? `-${sortColumn}` : sortColumn,
    name: searchQuery || undefined,
  });

  const { data: objectivesData } = useQuery({
    queryKey: ["objectives", { pageSize: 100 }],
    queryFn: () => api.objectives.list({ pageSize: 100 }),
  });

  const createMutation = keyresultsHooks.useCreate();
  const updateMutation = keyresultsHooks.useUpdate();
  const deleteMutation = keyresultsHooks.useDelete();

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleOpenDialog = (item?: KeyResult) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        objective: item.objective,
        targetValue: item.targetValue ?? 100,
        currentValue: item.currentValue ?? 0,
        unit: item.unit ?? "%",
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        objective: objectivesData?.results[0]?.id ?? 0,
        targetValue: 100,
        currentValue: 0,
        unit: "%",
      });
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

  const handleDelete = async (item: KeyResult) => {
    if (confirm(`Delete key result "${item.name}"?`)) {
      await deleteMutation.mutateAsync(item.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Key Results</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Key Result
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
              {editingItem ? "Edit Key Result" : "Add Key Result"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter key result name"
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
            <div className="space-y-2">
              <Label htmlFor="objective">Objective</Label>
              <Select
                value={String(formData.objective)}
                onValueChange={(value) => setFormData({ ...formData, objective: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectivesData?.results.map((obj) => (
                    <SelectItem key={obj.id} value={String(obj.id)}>
                      {obj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentValue">Current</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetValue">Target</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit ?? ""}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="%"
                />
              </div>
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
