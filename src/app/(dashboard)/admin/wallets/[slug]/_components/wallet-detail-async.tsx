import { cookies } from "next/headers";
import { getWalletById } from "@/apis/vinwallet/wallet";
import { WalletView } from "./wallet-view";
import { UsersTableInWallet } from "./users-table-in-wallet";
import { Suspense } from "react";
import { UsersTableSkeleton } from "./users-tables-skeleton";
import ContributionChartSkeleton from "./contribution-chart-skeleton";

import ContributionPieAsync from "./contribution-pie-async";
import { TransactionChartsAsync } from "./combined/transaction-charts-async";
import { TransactionChartsSkeleton } from "./combined/transaction-charts-skeleton";

interface WalletDetailAsyncProps {
  id: string;
  keyProps: string;
}

const WalletDetailAsync = async ({ id, keyProps }: WalletDetailAsyncProps) => {
  const cookieList = await cookies();
  const accessToken = cookieList.get("accessToken")?.value || "";
  const response = await getWalletById(id, accessToken);
  const wallet = response.payload;

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-12">
        <WalletView wallet={wallet} />
      </div>
      {wallet.type !== "Personal" ? (
        <>
          <div className="col-span-12 md:col-span-6">
            <Suspense key={keyProps} fallback={UsersTableSkeleton()}>
              <UsersTableInWallet walletId={wallet.id} wallet={wallet} />
            </Suspense>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Suspense key={keyProps} fallback={<ContributionChartSkeleton />}>
              <ContributionPieAsync walletId={wallet.id} />
            </Suspense>
          </div>
        </>
      ) : null}
      <div className="col-span-12">
        <Suspense key={keyProps} fallback={<TransactionChartsSkeleton />}>
          <TransactionChartsAsync walletId={wallet.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default WalletDetailAsync;
