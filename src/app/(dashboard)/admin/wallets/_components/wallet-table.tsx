// app/(dashboard)/admin/transactions/_components/wallet-tables/wallet-table.tsx
import { searchParamsCache } from "@/lib/searchparams";

import { getAllUsers } from "@/apis/vinwallet/user";
import { getAllWallets } from "@/apis/vinwallet/wallet";

import WalletTableContent from "./wallet-table-content";

const WalletTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const [usersResponse, walletsResponse] = await Promise.all([
    getAllUsers({}),
    getAllWallets(filters),
  ]);
  console.log("usersResponse", usersResponse);
  return (
    <WalletTableContent
      initialData={walletsResponse.payload.items}
      totalPages={walletsResponse.payload.totalPages}
    />
  );
};

export default WalletTable;
