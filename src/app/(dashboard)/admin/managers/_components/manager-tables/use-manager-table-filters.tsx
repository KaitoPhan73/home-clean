"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useManagerTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 700 })
      .withDefault("")
  );

  const [groupFilter, setGroupFilter] = useQueryState(
    "groupFilter",
    searchParams.q
      .withOptions({ shallow: false })
      .withDefault("all")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setGroupFilter("all");
    setPage(1);
  }, [setSearchQuery, setGroupFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || groupFilter !== "all";
  }, [searchQuery, groupFilter]);

  return {
    searchQuery,
    setSearchQuery,
    groupFilter,
    setGroupFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}