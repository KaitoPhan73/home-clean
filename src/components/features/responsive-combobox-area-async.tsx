"use client";

import React from "react";
import { useAreas } from "@/hooks/use-areas";
import { ResponsiveComboBox } from "@/components/async-combobox";

export function ResponsiveComboBoxAreaAsync({
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
  const { data, isLoading } = useAreas();

  const options =
    data?.map((area) => ({
      label: area.name,
      value: area.id,
      searchKey: `${area.name} ${area.code}`,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={isLoading}
      placeholder="Chọn khu vực"
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
      searchPlaceholder="Tìm kiếm khu vực..."
    />
  );
}
