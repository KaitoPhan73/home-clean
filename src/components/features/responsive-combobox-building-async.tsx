"use client";

import React from "react";
import { useBuildings } from "@/hooks/use-buildings";
import { ResponsiveComboBox } from "@/components/async-combobox";

export function ResponsiveComboBoxBuildingAsync({
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
  const { data, isLoading } = useBuildings();

  const options =
    data?.map((building) => ({
      label: building.name,
      value: building.code,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={isLoading}
      placeholder="Chọn tòa nhà"
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className} // 👈 truyền xuống
      portal={portal}
    />
  );
}
