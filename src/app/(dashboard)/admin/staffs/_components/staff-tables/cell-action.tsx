/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { StaffDetailPopup } from "@/app/(dashboard)/admin/staffs/_components/staff-tables/staff-detail";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TStaffResponse } from "@/schema/staff.schema";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: TStaffResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Các hành động</DropdownMenuLabel>

          {/* Nút Xem Chi Tiết */}
          <DropdownMenuItem
            onClick={() => setIsDetailPopupOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> Xem Chi Tiết
          </DropdownMenuItem>

          {/* Nút Chỉnh Sửa */}
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh Sửa
          </DropdownMenuItem>

          {/* Nút Xóa */}
          {/* <DropdownMenuItem 
            onClick={onDelete}
            className="cursor-pointer text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Xóa
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailPopupOpen && (
        <StaffDetailPopup
          staff={data}
          onClose={() => setIsDetailPopupOpen(false)}
        />
      )}
    </>
  );
};
