"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { useTransition } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  setPage: (page: number) => void;
  placeholder?: string;
  className?: string;
}

export function DataTableDateRange({
  dateRange,
  setDateRange,
  setPage,
  placeholder = "Chọn khoảng thời gian",
  className,
}: DateRangePickerProps) {
  const [isLoading, startTransition] = useTransition();

  const handleSelect = (range: DateRange | undefined) => {
    startTransition(() => {
      // Nếu range đã tồn tại và bấm lại vào ngày đã chọn, reset range
      if (
        range?.from &&
        dateRange?.from &&
        range.from.getTime() === dateRange.from.getTime() &&
        !range.to
      ) {
        setDateRange(undefined);
        return;
      }

      setDateRange(range);

      // Reset to first page only if a complete range is selected
      if (range?.from && range?.to) {
        setPage(1);
      }
    });
  };

  const handleClear = () => {
    startTransition(() => {
      setDateRange(undefined);
    });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !dateRange && "text-muted-foreground",
                isLoading && "animate-pulse"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                handleSelect(range);
              }}
              numberOfMonths={2}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
        {dateRange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
