"use client";

import { DataTableSearch } from "@/components/table/data-table-search";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useWalletTableFilters } from "./use-wallet-table-filters";
// import { CATEGORY_OPTIONS } from "../../../services/_components/service-tables/use-service-table-filters";
// import { DataTableSelect } from "@/components/table/data-table-select";

export default function WalletTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    // typeQuery,
    // setTypeQuery,
    setSearchQuery,
  } = useWalletTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        placeholder="Tìm kiếm tên ..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {/* <DataTableSelect
        selectKey="type"
        placeholder="Chọn loại giao dịch"
        setPage={setPage}
        options={CATEGORY_OPTIONS}
        setSelectValue={setTypeQuery}
        selectValue={typeQuery}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
