// app/(dashboard)/admin/transactions/_components/transaction-tables/transaction-table.tsx
import { searchParamsCache } from "@/lib/searchparams";
import { getAllTransactions } from "@/apis/transaction";
import { getAllUsers } from "@/apis/vinwallet/user";
import { getAllWallets } from "@/apis/vinwallet/wallet";
import { getAllPaymentMethods } from "@/apis/vinwallet/payment-metthod";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import TransactionTableContent from "@/app/(dashboard)/admin/transactions/_components/transaction-table-content";

const TransactionTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };

  const [
    transactionResponse,
    usersResponse,
    walletsResponse,
    paymentMethodsResponse,
  ] = await Promise.all([
    getAllTransactions(filters),
    getAllUsers({}),
    getAllWallets({}),
    getAllPaymentMethods({}),
  ]);

  const transactionPayload = transactionResponse.payload;
  const users = usersResponse.payload.items;
  const wallets = walletsResponse.payload.items;
  const paymentMethods = paymentMethodsResponse.payload.items;

  const enrichedTransactions: EnrichedTransaction[] =
    transactionPayload.items.map((transaction) => ({
      ...transaction,
      userName:
        users.find((user) => user.id === transaction.userId)?.fullName ||
        "Không xác định",
      walletName:
        wallets.find((wallet) => wallet.id === transaction.walletId)?.name ||
        "Không xác định",
      paymentMethodName:
        paymentMethods.find(
          (method) => method.id === transaction.paymentMethodId
        )?.name || "Không xác định",
    }));

  return (
    <TransactionTableContent 
      initialData={enrichedTransactions} 
      totalPages={transactionPayload.totalPages}
    />
  );
};

export default TransactionTable;