"use client";

import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useManagerTableFilters } from "@/app/(dashboard)/admin/managers/_components/manager-tables/use-manager-table-filters";

export default function ManagerTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    groupFilter,
    setGroupFilter
  } = useManagerTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="search"
        placeholder="Tìm kiếm tên hoặc mã..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <Select
        value={groupFilter}
        onValueChange={(value) => {
          setGroupFilter(value);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn nhóm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="has-group">Có nhóm</SelectItem>
          <SelectItem value="no-group">Chưa có nhóm</SelectItem>
        </SelectContent>
      </Select>
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}