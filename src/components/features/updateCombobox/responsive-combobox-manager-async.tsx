"use client";

import React from "react";
import { ResponsiveComboBox } from "@/components/async-combobox";
import { TManagerResponse } from "@/schema/manager.schema";

export function ResponsiveComboBoxManagerAsync({
  value,
  onChange,
  className,
  portal,
  data,
  currentData,
}: {
  value?: string;
  onChange: (v: string) => void;
  className?: string;
  portal?: boolean;
  data?: TManagerResponse[];
  currentData?: TManagerResponse[];
}) {
  const options =
    data?.map((manager) => ({
      label: manager.fullName,
      value: manager.id,
      searchKey: `${manager.fullName} ${manager.code}`,
    })) ?? [];
  const currentOptions =
    currentData?.map((manager) => ({
      label: manager.fullName,
      value: manager.id,
      searchKey: `${manager.fullName} ${manager.code}`,
    })) ?? [];

  console.log(
    "currentOptions",
    currentOptions.find((o) => o.value === value) ?? null
  );

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={false}
      placeholder="Chọn quản lý"
      defaultValue={currentOptions.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
      searchPlaceholder="Tìm kiếm quản lý..."
    />
  );
}
