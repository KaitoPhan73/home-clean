"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { DateRange } from "react-day-picker";

export function useWalletDetailFilters() {
  // Filter by days (1 day, 7 days, 14 days, 21 days, 30 days, current month)
  const [days, setDays] = useQueryState(
    "days",
    searchParams.days.withDefault("")
  );

  // Page state
  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  // Date range filters
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    searchParams.startDate.withDefault("")
  );

  const [endDate, setEndDate] = useQueryState(
    "endDate",
    searchParams.endDate.withDefault("")
  );

  // Search by member name
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  // Handle date range selection
  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      if (range?.from && range?.to) {
        setStartDate(range.from.toISOString());
        setEndDate(range.to.toISOString());
        setPage(1);
      }
    },
    [setStartDate, setEndDate, setPage]
  );

  const currentDateRange = useMemo(() => {
    if (!startDate) return undefined;

    return {
      from: new Date(startDate),
      to: endDate ? new Date(endDate) : undefined,
    };
  }, [startDate, endDate]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setDays(null);
    setStartDate(null);
    setEndDate(null);
    setSearchQuery(null);
    setPage(1);
  }, [setDays, setStartDate, setEndDate, setSearchQuery, setPage]);

  // Check if any filter is active
  const isAnyFilterActive = useMemo(() => {
    return !!days || !!searchQuery || (!!startDate && !!endDate);
  }, [days, searchQuery, startDate, endDate]);

  return {
    days,
    setDays,
    startDate,
    endDate,
    currentDateRange,
    handleDateRangeChange,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
