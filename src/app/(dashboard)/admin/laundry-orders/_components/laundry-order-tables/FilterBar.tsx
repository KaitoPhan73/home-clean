import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Search, CalendarRange, X } from "lucide-react";

interface FilterBarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const FilterBar = ({
  searchValue,
  setSearchValue,
  dateRange,
  onDateRangeChange,
  onSearch,
  onReset,
}: FilterBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white mb-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc ID người dùng..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <CalendarRange size={18} className="mr-2 text-gray-500" />
            <DatePickerWithRange
              selected={dateRange}
              onChange={onDateRangeChange}
            />
          </div>
          
          <Button variant="default" onClick={onSearch} className="bg-blue-600 hover:bg-blue-700">
            Tìm kiếm
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="border-gray-200 hover:bg-gray-50"
          >
            <X size={16} className="mr-1" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};