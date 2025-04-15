"use client";

import { TAdditionalServiceResponse } from "@/schema/VinLaudry/additional-service.schema";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface AdditionalServiceFilterProps {
  table: Table<TAdditionalServiceResponse>;
}

export const AdditionalServiceFilter: React.FC<AdditionalServiceFilterProps> = ({
  table,
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "Active" | "Inactive">("all");

  const handleSearch = (value: string) => {
    setSearch(value);
    table.setGlobalFilter(value);
  };

  const handleStatusFilter = (value: "all" | "Active" | "Inactive") => {
    setStatus(value);
    if (value === "all") {
      table.setColumnFilters([]);
    } else {
      table.setColumnFilters([{ id: "status", value }]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Tìm kiếm tên, mã dịch vụ, mô tả..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {search && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
            size={20}
            onClick={() => handleSearch("")}
          />
        )}
      </div>
      <Select value={status} onValueChange={handleStatusFilter}>
        <SelectTrigger className="w-48 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="Active">Hoạt động</SelectItem>
          <SelectItem value="Inactive">Không hoạt động</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};