"use client";

import React from "react";

import { ResponsiveComboBox } from "@/components/async-combobox";
import { TAreaResponse } from "@/schema/area.schema";

export function ResponsiveComboBoxAreaAsync({
  value,
  onChange,
  className,
  portal,
  data,
}: {
  value?: string;
  onChange: (v: string) => void;
  className?: string;
  portal?: boolean;
  data: TAreaResponse[]; // Thêm prop data để truyền vào
}) {
  const options =
    data?.map((area) => ({
      label: area.name,
      value: area.id,
      searchKey: `${area.name} ${area.code}`,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={false}
      placeholder="Chọn khu vực"
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
      searchPlaceholder="Tìm kiếm khu vực..."
    />
  );
}
