/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useTaskTableFilters } from "./use-task-table-filters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";

export default function TaskTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    status,
    setStatus,
  } = useTaskTableFilters();

  const statusOptions = [
    { label: "Tất cả", value: "" },
    { label: "Hoàn thành", value: "Completed" },
    { label: "Đang chờ", value: "Pending" },
    { label: "Đang xử lý", value: "inProgress" },
  ];

  const priorityOptions = [
    { label: "Tất cả", value: "" },
    { label: "Cao", value: "1" },
    { label: "Trung bình", value: "2" },
    { label: "Thấp", value: "3" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="search"
        placeholder="Tìm kiếm theo tên, mã hoặc ID nhiệm vụ..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`ml-auto flex items-center gap-1 ${status ? "bg-blue-50 text-blue-700 border-blue-300" : ""}`}
          >
            <Filter className="h-4 w-4" />
            <span>
              {status
                ? statusOptions.find((option) => option.value === status)?.label || "Trạng thái"
                : "Trạng thái"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={status === option.value}
              onCheckedChange={() => {
                setStatus(option.value || null);
                setPage(1);
              }}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
