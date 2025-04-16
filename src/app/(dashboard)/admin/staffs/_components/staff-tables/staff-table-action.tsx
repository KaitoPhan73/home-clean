"use client"; // Add this directive at the top

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StaffTableAction = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get the current search params
  const search = searchParams.get("search") || "";
  const staffType = searchParams.get("staffType") || "all";
  
  // Handle the search input with debounce
  const debouncedSearch = useDebounce(search, 500);
  
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, router, pathname, searchParams]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  // Handle staff type selection change
  const handleStaffTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("staffType", value);
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm nhân viên..."
          className="pl-8"
          defaultValue={search}
          onChange={handleSearchChange}
        />
      </div>
      
      <Select
        value={staffType}
        onValueChange={handleStaffTypeChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Chọn loại nhân viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả nhân viên</SelectItem>
          <SelectItem value="service">Nhân viên dịch vụ</SelectItem>
          <SelectItem value="laundry">Nhân viên giặt sấy</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffTableAction;