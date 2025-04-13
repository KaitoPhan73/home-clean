"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

// export const CATEGORY_OPTIONS = [
//   { value: "Electronics", label: "Electronics" },
//   { value: "Furniture", label: "Furniture" },
//   { value: "Clothing", label: "Clothing" },
//   { value: "Toys", label: "Toys" },
//   { value: "Groceries", label: "Groceries" },
//   { value: "Books", label: "Books" },
//   { value: "Jewelry", label: "Jewelry" },
//   { value: "Beauty Clusters", label: "Beauty Clusters" },
// ];
export function useClusterTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  // const [categoriesFilter, setCategoriesFilter] = useQueryState(
  //   "categories",
  //   searchParams.categories.withOptions({ shallow: false }).withDefault("")
  // );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    // setCategoriesFilter(null);

    setPage(1);
  }, [setSearchQuery, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery; //|| !!categoriesFilter
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    // categoriesFilter,
    // setCategoriesFilter,
  };
}
