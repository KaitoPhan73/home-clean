import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { columns } from "./building-tables/columns";
import { getBuildingsInCluster } from "@/apis/cluster";
type Props = {
  slug: string;
};
const BuildingTableCluster = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getBuildingsInCluster(slug, filters);

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

export default BuildingTableCluster;
