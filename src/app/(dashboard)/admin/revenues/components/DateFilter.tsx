import { TGroupResponse } from "@/schema/group.schema";
import { Dispatch, SetStateAction, useState } from "react";

interface DateFilterProps {
  dateFrom: Date;
  setDateFrom: Dispatch<SetStateAction<Date>>;
  dateTo: Date;
  setDateTo: Dispatch<SetStateAction<Date>>;
  selectedGroupId: string;
  setSelectedGroupId: Dispatch<SetStateAction<string>>;
  groups: TGroupResponse[];
  onFilterSubmit: () => void;
}

export function DateFilter({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  selectedGroupId,
  setSelectedGroupId,
  groups,
  onFilterSubmit,
}: DateFilterProps) {
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom.toISOString().split("T")[0]);
  const [localDateTo, setLocalDateTo] = useState(dateTo.toISOString().split("T")[0]);
  const [localGroupId, setLocalGroupId] = useState(selectedGroupId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setDateFrom(new Date(localDateFrom));
    setDateTo(new Date(localDateTo));
    setSelectedGroupId(localGroupId);
    
    // Call the filter submit function
    onFilterSubmit();
    
    // Simulate a short delay to show the loading state
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Từ ngày:</label>
          <input
            type="date"
            value={localDateFrom}
            onChange={(e) => setLocalDateFrom(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Đến ngày:</label>
          <input
            type="date"
            value={localDateTo}
            onChange={(e) => setLocalDateTo(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Nhóm:</label>
          <select
            value={localGroupId}
            onChange={(e) => setLocalGroupId(e.target.value)}
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
        <div className="flex-none self-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center min-w-[100px]`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang áp dụng...
              </>
            ) : (
              "Áp dụng"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}