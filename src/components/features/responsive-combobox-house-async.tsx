"use client";

import React from "react";
import { useHouses } from "@/hooks/use-houses";
import { ResponsiveComboBox } from "@/components/async-combobox";

export function ResponsiveComboBoxHouseAsync({
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
  const { data, isLoading } = useHouses();

  const options =
    data?.map((house) => ({
      label: `${house.no} - ${house.code}`,
      value: house.code,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={isLoading}
      placeholder="Chọn nhà"
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
    />
  );
}
