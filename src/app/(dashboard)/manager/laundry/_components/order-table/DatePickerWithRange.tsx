"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  onChange?: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  onChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if (onChange) {
      onChange(range);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(date.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={vi}
          />
          <div className="flex justify-between p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                handleDateChange({
                  from: addDays(today, -7),
                  to: today,
                });
              }}
            >
              7 ngày qua
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date();
                handleDateChange({
                  from: addDays(today, -30),
                  to: today,
                });
              }}
            >
              30 ngày qua
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}