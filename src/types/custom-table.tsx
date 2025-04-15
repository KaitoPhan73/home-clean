/* eslint-disable @typescript-eslint/no-explicit-any */
// components/table/custom-table.tsx
import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  SortAsc,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface TableColumn<T> {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { getValue: (key: string) => any; original: T } }) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  isLoading?: boolean;
}

export function CustomTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  searchTerm = "",
  isLoading = false,
}: TableProps<T>) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="space-y-4 relative">
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="border-b px-4 py-3 text-left font-medium text-slate-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <SortAsc className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="relative">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b transition-colors hover:bg-slate-50"
                  >
                    {columns.map((column, columnIndex) => (
                      <td key={columnIndex} className="px-4 py-3">
                        {column.cell
                          ? column.cell({
                              row: {
                                getValue: (key) => (row as any)[key],
                                original: row,
                              },
                            })
                          : (row as any)[column.accessorKey]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Trang {currentPage} / {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage >= totalPages || isLoading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}