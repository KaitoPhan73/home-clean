import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { parse, format, isValid } from "date-fns";

const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const seconds = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const periods = ["AM", "PM"];

export function TimePickerAMPM({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    const [time, per] = value.split(" ");
    if (time && per) {
      const [h, m, s] = time.split(":");
      if (h && m && s) {
        setHour(h);
        setMinute(m);
        setSecond(s);
        setPeriod(per as "AM" | "PM");
      }
    }
  }, [value]);

  const handleChange = (type: "h" | "m" | "s" | "p", val: string) => {
    const newHour = type === "h" ? val : hour;
    const newMinute = type === "m" ? val : minute;
    const newSecond = type === "s" ? val : second;
    const newPeriod = type === "p" ? val : period;

    const inputString = `${newHour}:${newMinute}:${newSecond} ${newPeriod}`;
    const parsedDate = parse(inputString, "hh:mm:ss a", new Date());

    if (isValid(parsedDate)) {
      const formatted24h = format(parsedDate, "HH:mm:ss");
      onChange(formatted24h);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[190px] justify-between">
          <span className="flex items-center gap-2">
            ⏰ {`${hour}:${minute}:${second}`} {period}
          </span>
          <span className="text-xs opacity-50">▾</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex gap-3 p-4 max-w-full overflow-x-auto">
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
                  onClick={() =>
                    handleChange(type as "h" | "m" | "s" | "p", item)
                  }
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
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ))}

        <div className="flex flex-col justify-between gap-2">
          {periods.map((p) => (
            <Button
              key={p}
              variant={p === period ? "default" : "ghost"}
              size="sm"
              onClick={() => handleChange("p", p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
