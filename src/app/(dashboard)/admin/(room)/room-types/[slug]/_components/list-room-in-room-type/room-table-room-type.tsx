import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { columns } from "./room-tables/columns";
import { getRoomsInRoomType } from "@/apis/room-type";
type Props = {
  slug: string;
};
const RoomTableRoomType = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getRoomsInRoomType(slug, filters);

  const responsePayload = response.payload;
  return (
    <div>
      <DataTable
        data={responsePayload.items}
        columns={columns}
        totalItems={responsePayload.total}
      />
    </div>
  );
};

export default RoomTableRoomType;
