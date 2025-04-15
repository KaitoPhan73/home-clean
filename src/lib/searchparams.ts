import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),
  status: parseAsString.withDefault("all"),
  days: parseAsString,
  q: parseAsString,
  search: parseAsString,
  gender: parseAsString,
  categories: parseAsString,
  refresh: parseAsString,
  timePeriod: parseAsString,
  startDate: parseAsString,
  endDate: parseAsString,
  types: parseAsString,
  areaId: parseAsString,
};

export function searchParamsToString(
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  return Object.entries(searchParams)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
