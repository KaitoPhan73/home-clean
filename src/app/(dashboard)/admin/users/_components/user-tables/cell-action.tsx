/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { updateVerifyUser } from "@/apis/vinwallet/user";
import { UserDetailPopup } from "@/app/(dashboard)/admin/users/_components/user-tables/user-detail";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorApi } from "@/lib/utils";
import { TUpdateUserRequest, TUserResponse } from "@/schema/user.schema";
import { Check, Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: TUserResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  const onDelete = () => {
    console.log("Deleting", data);
  };

  const onEdit = () => {
    console.log("Editing", data);
  };

  const onConfirm = async () => {};

  const confirmResident = async () => {
    try {
      setLoading(true);

      const updateData: TUpdateUserRequest = {
        fullName: data.fullName,
        username: data.username,
        buildingCode: data.houseId,
        houseCode: data.houseId,
        phoneNumber: data.phoneNumber,
        email: data.email,
        citizenCode: data.citizenCode,
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

          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh Sửa
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={confirmResident}
            className="cursor-pointer text-green-600"
            disabled={loading}
          >
            <Check className="mr-2 h-4 w-4" /> Xác Nhận Cư Dân
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailPopupOpen && (
        <UserDetailPopup
          user={data}
          onClose={() => setIsDetailPopupOpen(false)}
        />
      )}
    </>
  );
};
