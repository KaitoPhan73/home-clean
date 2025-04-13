"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

interface ResponsiveComboBoxProps {
  options: Option[];
  isLoading?: boolean;
  modal?: boolean;
  portal?: boolean; // 👈 thêm dòng này
  placeholder?: string;
  defaultValue?: Option | null;
  onChange?: (selected: Option | null) => void;
  className?: string;
}

export function ResponsiveComboBox({
  options,
  modal = true,
  isLoading = false,
  placeholder = "+ Select option",
  defaultValue = null,
  portal = true,
  onChange,
  className,
}: ResponsiveComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    defaultValue
  );

  const handleSelect = (value: string) => {
    const selected = options.find((opt) => opt.value === value) || null;
    setSelectedOption(selected);
    setOpen(false);
    if (onChange) onChange(selected);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen} modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[150px] justify-start", className)}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start" portal={portal}>
          <OptionList
            options={options}
            onSelect={handleSelect}
            isLoading={isLoading}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={modal}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[150px] justify-start", className)}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList
            options={options}
            onSelect={handleSelect}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList({
  options,
  onSelect,
  isLoading,
}: {
  options: Option[];
  onSelect: (value: string) => void;
  isLoading?: boolean;
}) {
  return (
    <Command>
      <CommandInput placeholder="Tìm..." />
      <CommandList>
        <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
        <CommandGroup>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <CommandItem key={index} value="" disabled>
                  <Skeleton className="h-5 w-full" />
                </CommandItem>
              ))
            : options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option.value}
                  onSelect={onSelect}
                >
                  {option.label}
                </CommandItem>
              ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
