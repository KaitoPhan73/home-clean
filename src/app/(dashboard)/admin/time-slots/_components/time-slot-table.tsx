import { DataTable } from "@/components/table/data-table";
import { columns } from "./time-slot-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllTimeSlots } from "@/apis/time-slot";

const TimeSlotTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const timeSlotResponse = await getAllTimeSlots(filters);
  const timeSlotPayload = timeSlotResponse.payload;
  return (
    <div>
      <DataTable
        data={timeSlotPayload.items}
        columns={columns}
        totalItems={timeSlotPayload.totalPages}
      />
    </div>
  );
};

export default TimeSlotTable;
