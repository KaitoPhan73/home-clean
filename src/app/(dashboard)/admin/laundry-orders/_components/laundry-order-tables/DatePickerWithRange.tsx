import React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export interface DatePickerWithRangeProps {
  selected: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export const DatePickerWithRange = ({ selected, onChange }: DatePickerWithRangeProps) => {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value ? new Date(e.target.value) : undefined;
    if (newFrom) {
      onChange({ from: newFrom, to: selected?.to });
    } else {
      onChange(undefined);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value ? new Date(e.target.value) : undefined;
    if (selected?.from) {
      onChange({ from: selected.from, to: newTo });
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <input
        type="date"
        value={selected?.from ? format(selected.from, "yyyy-MM-dd") : ""}
        onChange={handleFromChange}
        className="border rounded-md px-2 py-1"
      />
      <span>-</span>
      <input
        type="date"
        value={selected?.to ? format(selected.to, "yyyy-MM-dd") : ""}
        onChange={handleToChange}
        className="border rounded-md px-2 py-1"
      />
    </div>
  );
};