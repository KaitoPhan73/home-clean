"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";

const TaskTableFiltersContext = createContext<ReturnType<typeof useTaskTableFiltersState> | null>(null);

function useTaskTableFiltersState() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [status, setStatus] = useQueryState(
    "status",
    searchParams.status.withDefault("")
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatus(null);
    setPage(1);
  }, [setSearchQuery, setStatus, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!status;
  }, [searchQuery, status]);

  return {
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}

export function TaskTableFiltersProvider({ children }: { children: ReactNode }) {
  const filters = useTaskTableFiltersState();
  
  return (
    <TaskTableFiltersContext.Provider value={filters}>
      {children}
    </TaskTableFiltersContext.Provider>
  );
}

export function useTaskTableFilters() {
  const context = useContext(TaskTableFiltersContext);
  
  if (!context) {
    throw new Error("useTaskTableFilters must be used within a TaskTableFiltersProvider");
  }
  
  return context;
}