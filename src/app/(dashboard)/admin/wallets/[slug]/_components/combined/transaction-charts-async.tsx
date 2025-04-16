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

  const startDateTime = startDate ? new Date(startDate) : undefined;
  const endDateTime = endDate ? new Date(endDate) : undefined;

  const filters = {
    walletId,
    ...(timePeriod && { timePeriod }),
    ...(startDateTime && { startDate: startDateTime.toISOString() }),
    ...(endDateTime && { endDate: endDateTime.toISOString() }),
  };
  console.log("filters", filters);
  const response = await getTransactionWalletStatistics(filters);
  const data = response.payload;
  return <TransactionChartsCombined data={data} />;
}
