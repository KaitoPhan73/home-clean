/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useEmployeeTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    searchParams.status.withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPage(1);
  }, [setSearchQuery, setStatusFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}

// This function can be used if server filtering isn't working properly
export function filterEmployees(employees: any[], filters: { status?: string, search?: string }) {
  return employees.filter(employee => {
    // Filter by status if specified
    if (filters.status && employee.status !== filters.status) {
      return false;
    }
    
    // Filter by search term if specified
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const nameMatch = employee.staffName?.toLowerCase().includes(searchTerm);
      const codeMatch = employee.staffCode?.toLowerCase().includes(searchTerm);
      
      if (!nameMatch && !codeMatch) {
        return false;
      }
    }
    
    return true;
  });
}

// Optional: Use this hook in a client component to handle filtering client-side
export function useFilteredEmployees(employees: any[], filters: { status?: string, search?: string }) {
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  
  useEffect(() => {
    setFilteredEmployees(filterEmployees(employees, filters));
  }, [employees, filters.status, filters.search]);
  
  return filteredEmployees;
}