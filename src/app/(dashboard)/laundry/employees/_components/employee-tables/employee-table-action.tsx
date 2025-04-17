/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
"use client";

import { Button } from "@/components/ui/button";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/table/data-table-filter-box";
import { Loader2, RefreshCcw, User } from "lucide-react";
import { updateEmployeesRealTimeStatus } from "@/apis/laudry/employee";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Options } from "nuqs";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = [
  { label: "Sẵn Sàng", value: "Ready" },
  { label: "Nghỉ phép", value: "leave" },
  { label: "Đang Làm Việc", value: "Working" },
];

interface EmployeeTableActionProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function EmployeeTableAction({
  onRefresh,
  isLoading,
}: EmployeeTableActionProps) {
  const { isAnyFilterActive, resetFilters, statusFilter, setStatusFilter } =
    useEmployeeTableFilters();

  const [loadingRealTimeStatus, setLoadingRealTimeStatus] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchEmployeeRealTimeStatus = async () => {
    try {
      setLoadingRealTimeStatus(true);
      await updateEmployeesRealTimeStatus();
      router.refresh();

      toast({
        title: "Cập nhật thành công",
        description: "Đã cập nhật trạng thái của nhân viên",
        variant: "success",
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to update employee status:", error);
      toast({
        title: "Cập nhật thất bại",
        description: "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
        variant: "destructive",
      });
    } finally {
      setLoadingRealTimeStatus(false);
    }
  };

  const handleRefresh = () => {
    router.refresh();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {/* <DataTableFilterBox
          filterKey="status"
          title="Trạng thái"
          options={STATUS_OPTIONS}
          filterValue={setStatusFilter}
          filterValue={statusFilter}
          setFilterValue={function (
            value: string | ((old: string) => string | null) | null,
            options?: Options | undefined
          ): Promise<URLSearchParams> {
            throw new Error("Function not implemented.");
          }}
        /> */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchEmployeeRealTimeStatus}
          disabled={loadingRealTimeStatus}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          {loadingRealTimeStatus ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            <>
              <User className="h-4 w-4 mr-2" />
              Cập nhật trạng thái
            </>
          )}
        </Button>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || loadingRealTimeStatus}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button> */}
      </div>
    </div>
  );
}

// Add this hook inside the same file to ensure proper imports
function useEmployeeTableFilters() {
  // Import necessary hooks if they're not already defined
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );

  // Get the current status filter from URL or use empty string as default
  const [statusFilter, setStatusFilterInternal] = useState(
    searchParams.get("status") || ""
  );

  // Setter function that updates both state and URL
  const setStatusFilter = (value: string | null) => {
    setStatusFilterInternal(value || "");

    // Update URL query parameter
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  // Check if any filter is active
  const isAnyFilterActive = !!statusFilter;

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter(null);
    router.push(window.location.pathname);
  };

  return {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
  };
}
