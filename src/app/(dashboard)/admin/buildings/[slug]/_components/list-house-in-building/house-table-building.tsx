import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { getHousesInBuilding } from "@/apis/building";
import { columns } from "./house-tables/columns";
type Props = {
  slug: string;
};
const HouseTableBuilding = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    buildingId: slug,
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getHousesInBuilding(slug, filters);

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

export default HouseTableBuilding;
