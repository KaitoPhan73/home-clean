"use client";
import React from "react";
import { DataTableDateRange } from "@/components/table/data-table-date-range";
import { useWalletDetailFilters } from "./use-wallet-detail-filters";
const WalletFilter = () => {
  const { currentDateRange, handleDateRangeChange, setPage } =
    useWalletDetailFilters();

  console.log("currentDateRange", currentDateRange);
  return (
    <>
      <DataTableDateRange
        dateRange={currentDateRange}
        setDateRange={handleDateRangeChange}
        setPage={setPage}
        className="w-full md:w-[300px]"
      />
    </>
  );
};

export default WalletFilter;
