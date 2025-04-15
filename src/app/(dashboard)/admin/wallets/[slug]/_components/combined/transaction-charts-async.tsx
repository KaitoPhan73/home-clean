import { getTransactionWalletStatistics } from "@/apis/vinwallet/wallet";
import { TransactionChartsCombined } from "./transaction-charts-combined";
import { searchParamsCache } from "@/lib/searchparams";

export async function TransactionChartsAsync({
  walletId,
}: {
  walletId: string;
}) {
  const timePeriod = searchParamsCache.get("timePeriod");
  const startDate = searchParamsCache.get("startDate");
  const endDate = searchParamsCache.get("endDate");

  const filters = {
    walletId,
    ...(timePeriod && { timePeriod }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const response = await getTransactionWalletStatistics(filters);
  const data = response.payload;
  return <TransactionChartsCombined data={data} />;
}
