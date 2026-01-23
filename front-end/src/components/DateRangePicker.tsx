import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  startLabel?: string;
  endLabel?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startLabel = "Start Date",
  endLabel = "End Date",
  disabled = false,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">{startLabel}</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate ?? ""}
          onChange={(e) =>
            onStartDateChange(e.target.value || null)
          }
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">{endLabel}</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate ?? ""}
          onChange={(e) =>
            onEndDateChange(e.target.value || null)
          }
          disabled={disabled}
        />
      </div>
    </div>
  );
}
