"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  onChange?: (date: DateRange | undefined) => void;
  value?: DateRange | undefined;
}

export function DatePickerWithRange({ className, onChange, value }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: addDays(new Date(), -7),
      to: new Date(),
    }
  );

  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if (onChange) {
      onChange(range);
    }
  };

  const presets = [
    { label: "7 ngày qua", days: 7 },
    { label: "30 ngày qua", days: 30 },
    { label: "90 ngày qua", days: 90 },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn("justify-start text-left font-normal hover:bg-slate-50", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy", { locale: vi })} - {format(date.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-lg" align="end">
          <div className="p-3 border-b border-slate-100">
            <h3 className="font-medium text-sm">Chọn khoảng thời gian</h3>
          </div>
          <div className="grid grid-cols-2">
            <div className="border-r border-slate-100">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={1}
                locale={vi}
                className="p-2"
              />
            </div>
            <div className="p-2 space-y-4">
              <div className="space-y-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.days}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const today = new Date();
                      handleDateChange({
                        from: addDays(today, -preset.days),
                        to: today,
                      });
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (date) {
                      handleDateChange(date);
                      document.body.click();
                    }
                  }}
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}