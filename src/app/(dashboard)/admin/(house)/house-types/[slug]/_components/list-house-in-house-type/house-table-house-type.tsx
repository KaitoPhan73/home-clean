import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { getHousesInHouseType } from "@/apis/house-type";
import { columns } from "./house-tables/columns";
type Props = {
  slug: string;
};
const HouseTableHouseType = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    houseTypeId: slug,
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getHousesInHouseType(slug, filters);

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

export default HouseTableHouseType;
