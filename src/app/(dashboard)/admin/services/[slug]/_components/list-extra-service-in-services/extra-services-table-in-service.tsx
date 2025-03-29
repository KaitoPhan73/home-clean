import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { getExtraServicesInService } from "@/apis/service";
import { ExtraServiceColumns } from "./extra-services-tables/columns";
type Props = {
  slug: string;
};
const ExtraServiceTableInService = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getExtraServicesInService(slug, filters);

  const responsePayload = response.payload;
  return (
    <div>
      <DataTable
        data={responsePayload.items}
        columns={ExtraServiceColumns}
        totalItems={responsePayload.total}
      />
    </div>
  );
};

export default ExtraServiceTableInService;
