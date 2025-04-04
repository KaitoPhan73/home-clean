import { TGroupResponse } from "@/schema/group.schema";
import { Dispatch, SetStateAction } from "react";

interface DateFilterProps {
  dateFrom: Date;
  setDateFrom: Dispatch<SetStateAction<Date>>;
  dateTo: Date;
  setDateTo: Dispatch<SetStateAction<Date>>;
  selectedGroupId: string;
  setSelectedGroupId: Dispatch<SetStateAction<string>>;
  groups: TGroupResponse[];
}

export function DateFilter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedGroupId,
  setSelectedGroupId,
  groups,
}: DateFilterProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block mb-2">Từ ngày:</label>
        <input
          type="date"
          value={dateFrom.toISOString().split("T")[0]}
          onChange={(e) => setDateFrom(new Date(e.target.value))}
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block mb-2">Đến ngày:</label>
        <input
          type="date"
          value={dateTo.toISOString().split("T")[0]}
          onChange={(e) => setDateTo(new Date(e.target.value))}
          className="border rounded-md p-2 w-full"
        />
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block mb-2">Nhóm:</label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="all_groups">Tất cả các nhóm</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}