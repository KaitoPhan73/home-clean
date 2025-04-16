/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  changeOwnerWallet,
  deleteUserFromWallet,
  refetchUserInWallet,
} from "@/apis/vinwallet/wallet";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  walletId: string;
  isOwner: boolean;
}

export function UsersTableActions({ userId, walletId, isOwner }: Props) {
  const handleChangeOwner = async () => {
    try {
      await changeOwnerWallet(walletId, userId);
      await refetchUserInWallet(walletId);

      toast({
        title: "Thay đổi quyền thành công",
        description: "Đã thay đổi quyền chủ ví cho người dùng này",
        variant: "default",
      });
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  const handleRemoveUserFromWallet = async () => {
    try {
      await deleteUserFromWallet(walletId, userId);
      await refetchUserInWallet(walletId);
      toast({
        title: "Xóa thành công",
        description: "Đã xóa người dùng khỏi ví",
        variant: "default",
      });
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32">
          {isOwner ? "Chủ ví" : "Thành viên"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Thay đổi quyền</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleChangeOwner} disabled={isOwner}>
          Chủ ví
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          disabled={isOwner}
          onClick={handleRemoveUserFromWallet}
        >
          Xóa khỏi ví
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
