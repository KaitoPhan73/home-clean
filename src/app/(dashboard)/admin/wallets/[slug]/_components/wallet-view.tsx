"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, CreditCard, FileText } from "lucide-react";
import { TWalletResponse } from "@/schema/wallet.schema";

interface WalletViewProps {
  wallet: TWalletResponse;
  // onEdit?: () => void;
}

export function WalletView({ wallet }: WalletViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Thông tin ví</CardTitle>
        {/* <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button> */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thông tin cơ bản */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4" />
            Thông tin cơ bản
          </div>
          <Separator className="my-2.5" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Tên ví</div>
              <div className="mt-1 font-medium">{wallet.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Loại ví</div>
              <div className="mt-1">
                <Badge variant="outline" className="font-medium">
                  {wallet.type === "Personal" ? "Cá nhân" : "Chung"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin tài chính */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Thông tin tài chính
          </div>
          <Separator className="my-2.5" />
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Số dư</div>
              <div className="mt-1 font-medium text-lg">
                {Number(wallet.balance).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tiền tệ</div>
              <div className="mt-1">
                <Badge className="font-medium">{wallet.currency}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Ghi chú */}
        {wallet.extraField && (
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Ghi chú
            </div>
            <Separator className="my-2.5" />
            <div className="text-sm">{wallet.extraField}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
