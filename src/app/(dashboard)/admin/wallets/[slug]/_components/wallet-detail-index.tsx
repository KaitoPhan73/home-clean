import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/page-container";

// Import các components async
import WalletDetailAsync from "./wallet-detail-async";
import WalletFilter from "./wallet-filter";

type Props = {
  id: string;
  keyProps: string;
};

const WalletDetailIndex = ({ id, keyProps }: Props) => {
  console.log("WalletDetailIndex", keyProps);
  return (
    <PageContainer>
      <div className="space-y-4">
        <div>
          <WalletFilter />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
          <WalletDetailAsync id={id} keyProps={keyProps} />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default WalletDetailIndex;
