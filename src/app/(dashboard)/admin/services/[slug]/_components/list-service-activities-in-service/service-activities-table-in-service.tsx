import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
import { getServiceActivitiesInService } from "@/apis/service";
import { ServiceActivitycolumns } from "@/app/(dashboard)/admin/services/[slug]/_components/list-service-activities-in-service/_components/service-activities-tables/columns";
type Props = {
  slug: string;
};
const ServiceActivitiesDetailTableInService = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getServiceActivitiesInService(slug, filters);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const responsePayload = response.payload;
  return (
    <div>
      <DataTable
        data={responsePayload.items}
        columns={ServiceActivitycolumns}
        totalItems={responsePayload.total}
      />
    </div>
  );
};

export default ServiceActivitiesDetailTableInService;
