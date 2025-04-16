"use client";

import { searchParams } from "@/lib/searchparams";
import { format } from "date-fns";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { DateRange } from "react-day-picker";

export function useWalletDetailFilters() {
  const [days, setDays] = useQueryState(
    "days",
    searchParams.days.withOptions({ shallow: false }).withDefault("")
  );

  // Page state
  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [startDate, setStartDate] = useQueryState(
    "startDate",
    searchParams.startDate.withDefault("")
  );

  const [endDate, setEndDate] = useQueryState(
    "endDate",
    searchParams.endDate.withOptions({ shallow: false }).withDefault("")
  );
  // Search by member name
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setStartDate(range?.from ? format(range.from, "yyyy-MM-dd") : null);
      setEndDate(range?.to ? format(range.to, "yyyy-MM-dd") : null);
    },
    [setStartDate, setEndDate]
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
