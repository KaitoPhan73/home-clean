"use client";

import React from "react";
import { useUsers } from "@/hooks/use-users";
import { ResponsiveComboBox } from "@/components/async-combobox";

export function ResponsiveComboBoxUserAsync({
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
  const { data, isLoading } = useUsers();

  const options =
    data?.map((user) => ({
      label: (
        <div className="flex justify-between w-full">
          <div className="truncate flex-1 mr-2">{user.fullName}</div>
          <div className="">{user.phoneNumber}</div>
        </div>
      ),
      value: user.id,
      searchKey: `${user.fullName} ${user.phoneNumber}`,
    })) ?? [];

  return (
    <ResponsiveComboBox
      options={options}
      isLoading={isLoading}
      placeholder="Chọn người dùng"
      defaultValue={options.find((o) => o.value === value) ?? null}
      onChange={(selected) => onChange(selected?.value || "")}
      className={className}
      portal={portal}
    />
  );
}
