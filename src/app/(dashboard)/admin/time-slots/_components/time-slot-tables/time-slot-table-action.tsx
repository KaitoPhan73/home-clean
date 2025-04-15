"use client";

import { DataTableSearch } from "@/components/table/data-table-search";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useTimeSlotTableFilters } from "@/app/(dashboard)/manager/time-slots/_components/time-slot-tables/use-time-slot-table-filters";

export default function TimeSlotTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useTimeSlotTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        placeholder="Tìm kiếm ca làm việc"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {/* <DataTableFilterBox
        filterKey="categories"
        title="Categories"
        options={CATEGORY_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
