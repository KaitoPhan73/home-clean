import { getEquipmentSuppliesInService } from "@/apis/service";
import { EquipmentSuppliesColumns } from "@/app/(dashboard)/admin/services/[slug]/_components/list-equipment-supplies-in-services/equipment-supplies-tables/columns";
import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
type Props = {
  slug: string;
};
const EquipmentSuppliesTableInService = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getEquipmentSuppliesInService(slug, filters);

  const responsePayload = response.payload;
  return (
    <div>
      <DataTable
        data={responsePayload.items}
        columns={EquipmentSuppliesColumns}
        totalItems={responsePayload.total}
      />
    </div>
  );
};

export default EquipmentSuppliesTableInService;
