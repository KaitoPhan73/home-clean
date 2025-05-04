"use client";

import React from "react";
import { useGroups } from "@/hooks/use-groups";
import { ResponsiveComboBox } from "@/components/async-combobox";

export function ResponsiveComboBoxGroupAsync({
  value,
  onChange,
  className,
  portal,
}: {
  value?: string;
  onChange: (v: string) => void;
  className?: string;
  portal?: boolean;
}) {
  const { data, isLoading } = useGroups();

  const options =
    data?.map((group) => ({
      label: (
        <div className="flex  justify-between w-full">
          <div className="truncate">{group.name}</div>
          <div className="">{group.code}</div>
        </div>
      ),
      value: group.id,
      searchKey: `${group.name} ${group.code}`,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={isLoading}
      placeholder="Chọn nhóm"
      searchPlaceholder="Tìm theo tên hoặc mã..."
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
    />
  );
}
