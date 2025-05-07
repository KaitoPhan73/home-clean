/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmployeRealTimeStatus } from "@/apis/laudry/employee";
import { EmployeeDetailModal } from "@/app/(dashboard)/laundry/employees/_components/employee-tables/EmployeeDetailModal";

interface CellActionProps {
  data: EmployeRealTimeStatus;
  accessToken?: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, accessToken }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    // Delete action could go here if needed
  };

  const handleViewDetails = () => {
    setIsDetailModalOpen(true);
  };

  const handleEdit = () => {
    router.push(`/laundry/employees/${data.id}`);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <EmployeeDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={data}
        accessToken={accessToken}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleViewDetails}>
            <UserCheck className="mr-2 h-4 w-4" /> Xem chi tiết
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};