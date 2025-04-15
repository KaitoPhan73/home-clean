import React, { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageContainer from "@/components/layout/page-container";

// Import các components async
import WalletDetailAsync from "./wallet-detail-async";

type Props = {
  id: string;
  keyProps: string;
};

const WalletDetailIndex = ({ id, keyProps }: Props) => {
  console.log(keyProps);
  return (
    <PageContainer>
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
        <Card className="p-4 col-span-6 md:col-span-3 lg:col-span-12">
          <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
            <WalletDetailAsync id={id} />
          </Suspense>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WalletDetailIndex;
