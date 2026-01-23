import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/api/client";
import type { ObjectiveOwnership, OwnershipCreate } from "@/types";
import { X, UserCircle, Users, Shield } from "lucide-react";
import { useState } from "react";

interface OwnershipSelectorProps {
  ownerships: ObjectiveOwnership[];
  onAdd: (ownership: OwnershipCreate) => Promise<void>;
  onRemove: (ownerType: "user" | "role" | "group", ownerId: number) => Promise<void>;
  disabled?: boolean;
}

export function OwnershipSelector({
  ownerships,
  onAdd,
  onRemove,
  disabled = false,
}: OwnershipSelectorProps) {
  const [ownerType, setOwnerType] = useState<"user" | "role" | "group">("user");
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { data: usersData } = useQuery({
    queryKey: ["users", { pageSize: 100 }],
    queryFn: () => api.users.list({ pageSize: 100 }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles", { pageSize: 100 }],
    queryFn: () => api.roles.list({ pageSize: 100 }),
  });

  const { data: groupsData } = useQuery({
    queryKey: ["groups", { pageSize: 100 }],
    queryFn: () => api.groups.list({ pageSize: 100 }),
  });

  const getOwnerOptions = () => {
    switch (ownerType) {
      case "user":
        return usersData?.results ?? [];
      case "role":
        return rolesData?.results ?? [];
      case "group":
        return groupsData?.results ?? [];
      default:
        return [];
    }
  };

  const getOwnerIcon = (type: "user" | "role" | "group") => {
    switch (type) {
      case "user":
        return <UserCircle className="h-4 w-4" />;
      case "role":
        return <Shield className="h-4 w-4" />;
      case "group":
        return <Users className="h-4 w-4" />;
    }
  };

  const handleAdd = async () => {
    if (!ownerId) return;
    setIsAdding(true);
    try {
      await onAdd({ ownerType, ownerId });
      setOwnerId(null);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (ownership: ObjectiveOwnership) => {
    await onRemove(ownership.ownerType, ownership.ownerId);
  };

  return (
    <div className="space-y-4">
      <Label>Owners</Label>

      {/* Existing owners */}
      <div className="flex flex-wrap gap-2">
        {ownerships.map((ownership) => (
          <div
            key={`${ownership.ownerType}-${ownership.ownerId}`}
            className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm"
          >
            {getOwnerIcon(ownership.ownerType)}
            <span>{ownership.ownerName ?? `${ownership.ownerType} #${ownership.ownerId}`}</span>
            {!disabled && (
              <button
                onClick={() => handleRemove(ownership)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {ownerships.length === 0 && (
          <span className="text-muted-foreground text-sm">No owners assigned</span>
        )}
      </div>

      {/* Add new owner */}
      {!disabled && (
        <div className="flex gap-2 items-end">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={ownerType}
              onValueChange={(v) => {
                setOwnerType(v as "user" | "role" | "group");
                setOwnerId(null);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Select {ownerType}</Label>
            <Select
              value={ownerId?.toString() ?? ""}
              onValueChange={(v) => setOwnerId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${ownerType}`} />
              </SelectTrigger>
              <SelectContent>
                {getOwnerOptions().map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!ownerId || isAdding}
            size="sm"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
