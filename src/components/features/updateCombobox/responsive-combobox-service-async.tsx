"use client";

import React from "react";
import { ResponsiveComboBox } from "@/components/async-combobox";
import { TServiceResponse } from "@/schema/service.schema";

type Props = {
  value?: string | string[]; // Có thể nhận single hoặc array
  onChange: (v: string | string[]) => void; // Có thể trả về single hoặc array
  className?: string;
  portal?: boolean;
  isMultiSelect?: boolean;
  data: TServiceResponse[]; // Thêm prop data để truyền vào
};

export function ResponsiveComboBoxServiceAsync({
  value,
  onChange,
  className,
  portal,
  isMultiSelect = false,
  data,
}: Props) {
  const options = React.useMemo(
    () =>
      data?.map((service) => ({
        label: service.name,
        value: service.id,
        searchKey: `${service.name} ${service.code}`,
      })) ?? [],
    [data]
  );

  const valueArray = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  if (isMultiSelect) {
    const defaultValues = options.filter((opt) =>
      valueArray.includes(opt.value)
    );

    return (
      <ResponsiveComboBox
        options={options}
        isLoading={false}
        placeholder="Chọn dịch vụ"
        defaultValues={defaultValues}
        onChangeMultiple={(selected) => {
          const values = selected.map((opt) => opt.value);
          onChange(values);
        }}
        className={className}
        portal={portal}
        searchPlaceholder="Tìm kiếm dịch vụ..."
        isMulti={true}
      />
    );
  }

  // Xử lý single select
  return (
    <ResponsiveComboBox
      options={options}
      isLoading={false}
      placeholder="Chọn dịch vụ"
      defaultValue={options.find((o) => valueArray.includes(o.value)) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
      searchPlaceholder="Tìm kiếm dịch vụ..."
      isMulti={false}
    />
  );
}
