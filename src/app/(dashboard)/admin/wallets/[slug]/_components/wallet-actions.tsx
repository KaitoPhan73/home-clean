import { TWalletResponse } from "@/schema/wallet.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

interface WalletActionsProps {
  wallet: TWalletResponse;
}

export function WalletActions({ wallet }: WalletActionsProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            navigator.clipboard.writeText(wallet.id);
            toast.success("Đã sao chép ID ví");
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Sao chép ID
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            // Xử lý chỉnh sửa
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>

        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => {
            // Xử lý xóa
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa ví
        </Button>
      </CardContent>
    </Card>
  );
}
