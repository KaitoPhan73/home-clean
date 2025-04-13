import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  size: parseAsInteger.withDefault(10),
  q: parseAsString,
  search: parseAsString,
  gender: parseAsString,
  categories: parseAsString,
  types: parseAsString,
  areaId: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
