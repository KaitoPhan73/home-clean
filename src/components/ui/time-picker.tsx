"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { parse, isValid } from "date-fns";
import { Clock } from "lucide-react";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const seconds = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");

  useEffect(() => {
    let date: Date;

    if (value) {
      const tryDate = parse(value, "HH:mm:ss", new Date());
      date = isValid(tryDate) ? tryDate : new Date();
    } else {
      date = new Date();
    }

    setHour(date.getHours().toString().padStart(2, "0"));
    setMinute(date.getMinutes().toString().padStart(2, "0"));
    setSecond(date.getSeconds().toString().padStart(2, "0"));
  }, [value]);

  const updateTime = (h: string, m: string, s: string) => {
    const result = `${h}:${m}:${s}`;
    onChange(result);
  };

  const handleChange = (type: "h" | "m" | "s", val: string) => {
    const newHour = type === "h" ? val : hour;
    const newMinute = type === "m" ? val : minute;
    const newSecond = type === "s" ? val : second;

    setHour(newHour);
    setMinute(newMinute);
    setSecond(newSecond);

    updateTime(newHour, newMinute, newSecond);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[190px] justify-between", className)}
        >
          <span className="flex items-center gap-2">
            {`${hour}:${minute}:${second}`}
          </span>
          <Clock className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex gap-3 p-4 max-w-full overflow-x-auto"
        side="bottom"
        sideOffset={4}
      >
        {[
          { list: hours, type: "h", selected: hour },
          { list: minutes, type: "m", selected: minute },
          { list: seconds, type: "s", selected: second },
        ].map(({ list, type, selected }) => (
          <ScrollArea key={type} className="h-40 w-14 border rounded-md">
            <ul className="space-y-1 text-center py-1">
              {list.map((item) => (
                <li
                  key={item}
                  onClick={() => handleChange(type as "h" | "m" | "s", item)}
                  className={cn(
                    "cursor-pointer py-1 rounded-md hover:bg-muted",
                    item === selected &&
                      "bg-accent text-accent-foreground font-semibold"
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        ))}
      </PopoverContent>
    </Popover>
  );
}
