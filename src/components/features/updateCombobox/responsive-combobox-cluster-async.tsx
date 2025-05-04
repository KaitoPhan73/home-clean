"use client";

import React from "react";

import { ResponsiveComboBox } from "@/components/async-combobox";
import { TClusterResponse } from "@/schema/cluster.schema";

type Props = {
  value?: string | string[];
  onChange: (v: string | string[]) => void; // Sửa kiểu return để hỗ trợ cả array
  className?: string;
  portal?: boolean;
  isMultiSelect?: boolean; // Đổi tên từ isMulti thành isMultiSelect
  data: TClusterResponse[]; // Thêm prop data để truyền vào
};

export function ResponsiveComboBoxClusterAsync({
  value,
  onChange,
  className,
  portal,
  isMultiSelect = false,
  data,
}: Props) {
  const options =
    data?.map((cluster) => ({
      label: cluster.name,
      value: cluster.id,
      searchKey: `${cluster.name} ${cluster.code}`,
    })) ?? [];

  // Convert value thành array nếu cần
  const valueArray = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  if (isMultiSelect) {
    // Xử lý multiple select
    const defaultValues = options.filter((opt) =>
      valueArray.includes(opt.value)
    );

    return (
      <ResponsiveComboBox
        options={options}
        isLoading={false}
        placeholder="Chọn cụm"
        defaultValues={defaultValues}
        onChangeMultiple={(selected) => {
          const values = selected.map((opt) => opt.value);
          onChange(values);
        }}
        className={className}
        portal={portal}
        searchPlaceholder="Tìm kiếm cụm..."
        isMulti={isMultiSelect} // Truyền isMultiSelect xuống
      />
    );
  }

  // Xử lý single select
  return (
    <ResponsiveComboBox
      options={options}
      isLoading={false}
      placeholder="Chọn cụm"
      defaultValue={options.find((o) => valueArray.includes(o.value)) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
      searchPlaceholder="Tìm kiếm cụm..."
      isMulti={isMultiSelect}
    />
  );
}
