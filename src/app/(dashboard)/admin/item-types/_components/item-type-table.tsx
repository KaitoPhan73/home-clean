import { DataTable } from "@/components/table/data-table";
import { ItemTypeColumns } from "./item-type-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllItemTypes } from "@/apis/laudry/item-type";

const ItemTypeTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const itemTypeResponse = await getAllItemTypes(filters);
  const itemTypePayload = itemTypeResponse.payload;
  return (
    <div>
      <DataTable
        data={itemTypePayload.items}
        columns={ItemTypeColumns}
        totalItems={itemTypePayload.totalPages}
      />
    </div>
  );
};

export default ItemTypeTable;
