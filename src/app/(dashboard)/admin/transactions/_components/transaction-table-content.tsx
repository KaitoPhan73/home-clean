// app/(dashboard)/admin/transactions/_components/transaction-tables/transaction-table-content.tsx
"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { EnrichedTransaction } from "@/schema/transaction.schema";
import { TransactionColumn } from "@/app/(dashboard)/admin/transactions/_components/transaction-tables/transaction-column";

interface TransactionTableContentProps {
  initialData: EnrichedTransaction[];
  totalPages: number;
}

export default function TransactionTableContent({
  initialData,
  totalPages,
}: TransactionTableContentProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const filteredTransactions = initialData
    .filter(tx => 
      !statusFilter || tx.status === statusFilter
    )
    .filter(tx =>
      searchValue === "" ||
      tx.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
      tx.paymentMethodName.toLowerCase().includes(searchValue.toLowerCase()) ||
      tx.amount.toString().includes(searchValue)
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Input 
          placeholder="Tìm kiếm giao dịch..." 
          className="max-w-sm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Bộ lọc</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuCheckboxItem
                checked={!statusFilter}
                onSelect={() => setStatusFilter(null)}
              >
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "Success"}
                onSelect={() => setStatusFilter("Success")}
              >
                Thành công
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "Failed"}
                onSelect={() => setStatusFilter("Failed")}
              >
                Thất bại
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "Pending"}
                onSelect={() => setStatusFilter("Pending")}
              >
                Đang chờ
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span>Thêm mới</span>
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredTransactions}
        columns={TransactionColumn}
        totalItems={totalPages}
      />
    </div>
  );
}