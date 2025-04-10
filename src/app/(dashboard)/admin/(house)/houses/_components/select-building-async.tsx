"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBuildings } from "@/apis/building";
import { TBuildingResponse } from "@/schema/building.schema";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SelectBuildingAsync = ({ value, onChange }: Props) => {
  const [buildings, setBuildings] = useState<TBuildingResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        const res = await getAllBuildings();
        setBuildings(res.payload.items); // Dựa theo cấu trúc của TTableResponse
      } catch (err) {
        console.error("Lỗi khi tải danh sách tòa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger>
        <SelectValue placeholder="Chọn tòa nhà" />
      </SelectTrigger>
      <SelectContent>
        {buildings.map((building) => (
          <SelectItem key={building.id} value={building.id}>
            {building.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
