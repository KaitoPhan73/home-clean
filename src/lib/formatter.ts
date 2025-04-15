/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
export const formatDate = (
  date: string | Date,
  locale: "vi" | "en" = "en"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  const selectedLocale = locale === "vi" ? vi : enUS;

  return format(dateObj, "dd/MM/yyyy", { locale: selectedLocale });
};

export const formattedDate = (timestamp: any) => {
  return format(new Date(timestamp), "dd/MM/yyyy");
};

export const formattedDateTime = (timestamp: any) => {
  return format(new Date(timestamp), "dd/MM/yyyy HH:mm");
};

export const formatPriceVND = (price: any) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // Không hiển thị phần thập phân
  });
};
export const formatNumberWithDot = (num: any) => {
  return num.toLocaleString("de-DE");
};

export const formatPoint = (price: any) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // Không hiển thị phần thập phân
  });
};
