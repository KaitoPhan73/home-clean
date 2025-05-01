// search-inputs.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";

export default function SearchInputs() {
  const [search, setSearch] = useQueryState("search");
  const [groupSearch, setGroupSearch] = useQueryState("groupSearch");

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Label htmlFor="search">Tìm kiếm mã hoặc tên quản lý</Label>
        <Input
          id="search"
          placeholder="Nhập mã hoặc tên quản lý..."
          value={search || ""}
          onChange={(e) => setSearch(e.target.value || null)}
          className="mt-1"
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="groupSearch">Tìm kiếm theo tên nhóm</Label>
        <Input
          id="groupSearch"
          placeholder="Nhập tên nhóm hoặc 'Chưa có nhóm'..."
          value={groupSearch || ""}
          onChange={(e) => setGroupSearch(e.target.value || null)}
          className="mt-1"
        />
      </div>
    </div>
  );
}