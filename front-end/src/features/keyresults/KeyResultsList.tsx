import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable, type Column } from "@/components/DataTable";
import { DateRangePicker } from "@/components/DateRangePicker";
import { ReactionBar } from "@/components/ReactionBar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { keyresultsHooks } from "@/hooks/useApi";
import { api } from "@/api/client";
import type { KeyResult, KeyResultCreate } from "@/types";
import { Plus, CheckCircle2, Circle, Calendar } from "lucide-react";

export function KeyResultsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KeyResult | null>(null);
  const [formData, setFormData] = useState<KeyResultCreate & { isComplete?: boolean }>({
    name: "",
    description: "",
    objective: 0,
    targetValue: 100,
    currentValue: 0,
    unit: "%",
    startDate: null,
    endDate: null,
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

  // Toggle completion mutation
  const toggleCompleteMutation = useMutation({
    mutationFn: ({ id, isComplete }: { id: number; isComplete: boolean }) =>
      api.keyresults.update(id, { isComplete }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyresults"] });
      queryClient.invalidateQueries({ queryKey: ["objectives"] });
    },
  });

  const handleToggleComplete = async (item: KeyResult) => {
    await toggleCompleteMutation.mutateAsync({
      id: item.id,
      isComplete: !item.isComplete,
    });
  };

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
    {
      key: "isComplete",
      label: "Complete",
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete(item);
          }}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          {item.isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      ),
    },
    {
      key: "reactions",
      label: "Reactions",
      render: (item) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ReactionBar keyResultId={item.id} />
        </div>
      ),
    },
    {
      key: "effectiveStartDate",
      label: "Dates",
      render: (item) =>
        item.effectiveStartDate || item.effectiveEndDate ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {item.effectiveStartDate ?? "—"} to {item.effectiveEndDate ?? "—"}
            </span>
            {(item.startDate || item.endDate) && (
              <span className="text-xs">(custom)</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

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
        startDate: item.startDate,
        endDate: item.endDate,
        isComplete: item.isComplete,
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
        startDate: null,
        endDate: null,
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
        <DialogContent className="max-w-2xl">
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

            <DateRangePicker
              startDate={formData.startDate ?? null}
              endDate={formData.endDate ?? null}
              onStartDateChange={(date) => setFormData({ ...formData, startDate: date })}
              onEndDateChange={(date) => setFormData({ ...formData, endDate: date })}
              startLabel="Start Date (override)"
              endLabel="End Date (override)"
            />

            {editingItem && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isComplete"
                  checked={formData.isComplete ?? false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isComplete: checked === true })
                  }
                />
                <Label htmlFor="isComplete" className="cursor-pointer">
                  Mark as complete
                </Label>
              </div>
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
