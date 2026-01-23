import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Frequency, RecurringScheduleCreate, User } from "@/types";
import { CalendarClock, Repeat, Users, X } from "lucide-react";

interface RecurringScheduleFormProps {
  keyResultId: number;
  onClose?: () => void;
}

const frequencyOptions: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function RecurringScheduleForm({
  keyResultId,
  onClose,
}: RecurringScheduleFormProps) {
  const queryClient = useQueryClient();

  const { data: existingSchedule, isLoading: scheduleLoading } = useQuery({
    queryKey: ["recurring", keyResultId],
    queryFn: () => api.recurring.get(keyResultId),
  });

  const { data: usersResponse } = useQuery({
    queryKey: ["users", { pageSize: 100 }],
    queryFn: () => api.users.list({ pageSize: 100 }),
  });

  const users = usersResponse?.results ?? [];

  const [frequency, setFrequency] = useState<Frequency>(
    existingSchedule?.frequency ?? "weekly"
  );
  const [nextDueDate, setNextDueDate] = useState(
    existingSchedule?.nextDueDate ?? new Date().toISOString().split("T")[0]
  );
  const [rotationEnabled, setRotationEnabled] = useState(
    existingSchedule?.rotationEnabled ?? false
  );
  const [selectedUsers, setSelectedUsers] = useState<number[]>(
    existingSchedule?.rotationUsers ?? []
  );

  const createMutation = useMutation({
    mutationFn: (data: RecurringScheduleCreate) =>
      api.recurring.create(keyResultId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      onClose?.();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: RecurringScheduleCreate) =>
      api.recurring.update(keyResultId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      onClose?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.recurring.delete(keyResultId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      onClose?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: RecurringScheduleCreate = {
      frequency,
      nextDueDate,
      rotationEnabled,
      rotationUsers: rotationEnabled ? selectedUsers : undefined,
    };

    if (existingSchedule) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (scheduleLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Recurring Schedule</h3>
        </div>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Frequency
        </label>
        <div className="flex gap-2">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFrequency(option.value)}
              className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                frequency === option.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Next Due Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Next Due Date
        </label>
        <Input
          type="date"
          value={nextDueDate}
          onChange={(e) => setNextDueDate(e.target.value)}
          required
        />
      </div>

      {/* Rotation Toggle */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-10 h-6 rounded-full transition-colors ${
              rotationEnabled ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => setRotationEnabled(!rotationEnabled)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                rotationEnabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </div>
          <span className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Enable Rotation
          </span>
        </label>
        <p className="text-xs text-muted-foreground">
          Automatically rotate assignees when task regenerates
        </p>
      </div>

      {/* User Selection for Rotation */}
      {rotationEnabled && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Rotation Members
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30 min-h-[60px]">
            {users.length === 0 ? (
              <p className="text-xs text-muted-foreground">No users available</p>
            ) : (
              users.map((user: User) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedUsers.includes(user.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {user.name}
                  {selectedUsers.includes(user.id) && (
                    <span className="ml-1.5 text-xs">
                      #{selectedUsers.indexOf(user.id) + 1}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
          {selectedUsers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Order: {selectedUsers.map((id) => users.find((u: User) => u.id === id)?.name).join(" → ")}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {existingSchedule && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={isPending}
            className="flex-1"
          >
            Remove Schedule
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="flex-1">
          {existingSchedule ? "Update" : "Create"} Schedule
        </Button>
      </div>
    </form>
  );
}
