/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Pencil, Check, Wallet } from "lucide-react";
import { toast } from "sonner";

import { TUpdateUserRequest, TUserResponse } from "@/schema/user.schema";
import { updateVerifyUser } from "@/apis/vinwallet/user";
import { handleErrorApi } from "@/lib/utils";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDetailPopup } from "@/app/(dashboard)/admin/users/_components/user-tables/user-detail";
import { UserEditPopup } from "@/app/(dashboard)/admin/users/_components/user-tables/user-edit";
import { WalletTransactionPopup } from "@/app/(dashboard)/admin/users/_components/user-tables/WalletTransactionPopup";

interface CellActionProps {
  data: TUserResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isWalletTransactionPopupOpen, setIsWalletTransactionPopupOpen] = useState(false);

  const onConfirm = async () => {};

  const confirmResident = async () => {
    try {
      setLoading(true);

      const updateData: TUpdateUserRequest = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        houseId: data.houseId,
      };

      await updateVerifyUser(data.id, updateData);
      toast.success("Xác nhận cư dân thành công!");
      router.refresh();
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Các hành động</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => setIsDetailPopupOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> Xem Chi Tiết
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsEditPopupOpen(true)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh Sửa
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsWalletTransactionPopupOpen(true)}
            className="cursor-pointer"
          >
            <Wallet className="mr-2 h-4 w-4" /> Ví & Giao Dịch
          </DropdownMenuItem>

          {data.status !== "Active" && (
            <DropdownMenuItem
              onClick={confirmResident}
              className="cursor-pointer text-green-600"
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4" /> Xác Nhận Cư Dân
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailPopupOpen && (
        <UserDetailPopup
          user={data}
          onClose={() => setIsDetailPopupOpen(false)}
        />
      )}
      
      {isEditPopupOpen && (
        <UserEditPopup
          user={data}
          onClose={() => setIsEditPopupOpen(false)}
        />
      )}

      <WalletTransactionPopup 
        user={data}
        isOpen={isWalletTransactionPopupOpen}
        onClose={() => setIsWalletTransactionPopupOpen(false)}
      />
    </>
  );
};