"use client"

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const StaffTableFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const activeTab = searchParams.get("tab") || "service";

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search")?.toString() || "");
  
  // Custom debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, pathname, replace]);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder={activeTab === "service" ? "Tìm nhân viên dịch vụ..." : "Tìm nhân viên giặt sấy..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default StaffTableFilter;