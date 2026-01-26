import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface SelectableItem {
  id: number;
  name: string;
}

interface RelationshipSelectorProps {
  label: string;
  availableItems: SelectableItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  variant?: "user" | "role" | "group" | "organization" | "default";
  isLoading?: boolean;
}

export function RelationshipSelector({
  label,
  availableItems,
  selectedIds,
  onChange,
  variant = "default",
  isLoading = false,
}: RelationshipSelectorProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const selectedItems = availableItems.filter((item) =>
    selectedIds.includes(item.id)
  );
  const unselectedItems = availableItems.filter(
    (item) => !selectedIds.includes(item.id)
  );

  const handleAdd = () => {
    if (selectedValue) {
      const id = parseInt(selectedValue, 10);
      if (!selectedIds.includes(id)) {
        onChange([...selectedIds, id]);
      }
      setSelectedValue("");
    }
  };

  const handleRemove = (id: number) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Selected items */}
      <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border rounded-lg bg-muted/30">
        {selectedItems.length === 0 ? (
          <span className="text-muted-foreground text-sm">None selected</span>
        ) : (
          selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant={variant}
              className="flex items-center gap-1 pr-1"
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="ml-1 rounded-full hover:bg-black/10 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Add new item */}
      {unselectedItems.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={selectedValue}
            onValueChange={setSelectedValue}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`Add ${label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {unselectedItems.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAdd}
            disabled={!selectedValue || isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
