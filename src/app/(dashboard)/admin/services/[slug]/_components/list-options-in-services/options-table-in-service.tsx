import { getOptionsInService } from "@/apis/service";
import { OptionColumns } from "@/app/(dashboard)/admin/services/[slug]/_components/list-options-in-services/options-tables/columns";
import { DataTable } from "@/components/table/data-table";

import { searchParamsCache } from "@/lib/searchparams";
type Props = {
  slug: string;
};
const OptionsTableInService = async ({ slug }: Props) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");
  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const response = await getOptionsInService(slug, filters);

  const responsePayload = response.payload;
  return (
    <div>
      <DataTable
        data={responsePayload.items}
        columns={OptionColumns}
        totalItems={responsePayload.total}
      />
    </div>
  );
};

export default OptionsTableInService;
