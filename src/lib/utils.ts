import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  duration,
}: {
  error: Error;
  duration?: number;
}) => {
  const parseError = JSON.parse(error.message);
  toast({
    title: "Oh no! Đã có lỗi xảy ra",
    description: parseError.description ?? "Lỗi không xác định",
    variant: "destructive",
    duration: duration ?? 5000,
  });
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Hàm định dạng ngày theo format DD/MM/YYYY
 * @param date - Ngày cần định dạng (chuỗi hoặc đối tượng Date)
 * @returns Chuỗi ngày đã định dạng theo DD/MM/YYYY
 */
export const formatDate = (date: Date | string): string => {
  return format(new Date(date), "dd/MM/yyyy");
};
