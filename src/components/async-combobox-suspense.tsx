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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";

type Option = {
  value: string;
  label: React.ReactNode;
  searchKey?: string;
};

interface SuspenseResponsiveComboBoxProps {
  options: Option[];
  modal?: boolean;
  portal?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  defaultValue?: Option | null;
  defaultValues?: Option[];
  onChange?: (selected: Option | null) => void;
  onChangeMultiple?: (selected: Option[]) => void;
  className?: string;
  isMulti?: boolean;
}

export function SuspenseResponsiveComboBox({
  options,
  modal = true,
  placeholder = "+ Select option",
  defaultValue = null,
  defaultValues = [],
  portal = true,
  searchPlaceholder,
  onChange,
  onChangeMultiple,
  className,
  isMulti = false,
}: SuspenseResponsiveComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(
    defaultValue
  );
  const [selectedOptions, setSelectedOptions] =
    React.useState<Option[]>(defaultValues);

  const handleSelect = (value: string) => {
    if (isMulti) {
      const option = options.find((opt) => opt.value === value);
      if (option) {
        const isSelected = selectedOptions.some((opt) => opt.value === value);
        let newSelected: Option[];
        if (isSelected) {
          newSelected = selectedOptions.filter((opt) => opt.value !== value);
        } else {
          newSelected = [...selectedOptions, option];
        }
        setSelectedOptions(newSelected);
        if (onChangeMultiple) onChangeMultiple(newSelected);
      }
    } else {
      const selected = options.find((opt) => opt.value === value) || null;
      setSelectedOption(selected);
      setOpen(false);
      if (onChange) onChange(selected);
    }
  };

  const removeOption = (optionToRemove: Option) => {
    const newSelected = selectedOptions.filter(
      (opt) => opt.value !== optionToRemove.value
    );
    setSelectedOptions(newSelected);
    if (onChangeMultiple) onChangeMultiple(newSelected);
  };

  const selectedView = isMulti ? (
    <div className="flex flex-wrap gap-1">
      {selectedOptions.length > 0 ? (
        selectedOptions.map((option) => (
          <Badge
            key={option.value}
            variant="outline"
            className="flex items-center gap-1"
          >
            <span className="text-sm">{option.label}</span>
            <X
              className="h-4 w-4"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            />
          </Badge>
        ))
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  ) : (
    selectedOption?.label || placeholder
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen} modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start min-h-[40px] h-auto",
              isMulti && "flex-wrap",
              className
            )}
          >
            {selectedView}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 popover-content-width-full"
          align="start"
          portal={portal}
        >
          <div className="w-full">
            <OptionList
              options={options}
              onSelect={handleSelect}
              searchPlaceholder={searchPlaceholder}
              isMulti={isMulti}
              selectedOptions={selectedOptions}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={modal}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[150px] justify-start min-h-[40px] h-auto",
            isMulti && "flex-wrap",
            className
          )}
        >
          {selectedView}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t w-full">
          <OptionList
            options={options}
            onSelect={handleSelect}
            searchPlaceholder={searchPlaceholder}
            isMulti={isMulti}
            selectedOptions={selectedOptions}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function OptionList({
  options,
  onSelect,
  searchPlaceholder,
  isMulti,
  selectedOptions = [],
}: {
  options: Option[];
  onSelect: (value: string) => void;
  searchPlaceholder?: string;
  isMulti?: boolean;
  selectedOptions?: Option[];
}) {
  return (
    <div className="w-full">
      <Command className="w-full">
        <CommandInput
          placeholder={searchPlaceholder ? searchPlaceholder : "Tìm..."}
          className="w-full"
        />
        <CommandList className="w-full">
          <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
          <CommandGroup className="w-full">
            {options.map((option, index) => (
              <CommandItem
                key={index}
                value={option.searchKey || option.value}
                onSelect={() => onSelect(option.value)}
                className="w-full"
              >
                <div className="flex items-center gap-2 w-full">
                  {isMulti && (
                    <Checkbox
                      checked={selectedOptions.some(
                        (opt) => opt.value === option.value
                      )}
                      className="h-4 w-4"
                    />
                  )}
                  {option.label}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
