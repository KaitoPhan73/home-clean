// StaffSearchFilter.tsx
import React from "react";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface StaffSearchFilterProps {
  searchQuery: string;
  statusFilter: string;
  isRefreshing: boolean;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
}

const StaffSearchFilter: React.FC<StaffSearchFilterProps> = ({
  searchQuery,
  statusFilter,
  isRefreshing,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc email"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ready">Sẵn sàng</SelectItem>
            <SelectItem value="working">Đang làm việc</SelectItem>
            <SelectItem value="away">Vắng mặt</SelectItem>
            <SelectItem value="offline">Ngoại tuyến</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default StaffSearchFilter;