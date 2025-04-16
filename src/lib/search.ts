// lib/searchparams.ts
"use client";

import { useSearchParams as useNextSearchParams } from "next/navigation";

// Cache to store current search params values
export const searchParamsCache = new Map<string, string>();

// Hook to use search params and update the cache
export function useSearchParams() {
  const params = useNextSearchParams();
  
  // Update cache with current values
  params.forEach((value, key) => {
    searchParamsCache.set(key, value);
  });
  
  return params;
}

// Function to create URL with updated search params
export function createQueryString(
  params: Record<string, string | number | null | undefined>,
  currentParams?: URLSearchParams
) {
  const newParams = new URLSearchParams(currentParams?.toString() || "");
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });
  
  return newParams.toString();
}