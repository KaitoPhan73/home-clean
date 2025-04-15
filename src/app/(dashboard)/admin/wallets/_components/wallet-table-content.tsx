"use client";

import { DataTable } from "@/components/table/data-table";
import { WalletColumn } from "./wallet-tables/wallet-column";
import { TWalletResponse } from "@/schema/wallet.schema";

interface WalletTableContentProps {
  initialData: TWalletResponse[];
  totalPages: number;
}

export default function WalletTableContent({
  initialData,
  totalPages,
}: WalletTableContentProps) {
  return (
    <div className="space-y-4">
      <DataTable
        data={initialData}
        columns={WalletColumn}
        totalItems={totalPages}
      />
    </div>
  );
}
