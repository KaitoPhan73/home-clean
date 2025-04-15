import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),
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

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
