"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Plus, Users, Shirt } from "lucide-react";
import { CredenzaCreateServiceStaff } from "@/app/(dashboard)/admin/staffs/_components/credenza-create-service-staff";
import { CredenzaCreateLaudryStaff } from "@/app/(dashboard)/admin/staffs/_components/credenza-create-laundry-staff";
import { useRouter } from "next/navigation";

type StaffTableProps = {
  accessToken?: string;
};

const StaffActionDropdown = ({ accessToken }: StaffTableProps) => {
  const [activeDialog, setActiveDialog] = useState<
    "service" | "laundry" | null
  >(null);
  const router = useRouter();

  const handleOpenServiceForm = () => {
    setActiveDialog("service");
  };

  const handleOpenLaundryForm = () => {
    setActiveDialog("laundry");
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    // Đảm bảo UI được refresh
    router.refresh();
  };

  return (
    <>
      {activeDialog === "service" && (
        <CredenzaCreateServiceStaff
          onClose={handleCloseDialog}
          isOpen={true} 
        />
      )}

      {activeDialog === "laundry" && (
        <CredenzaCreateLaudryStaff
          accessToken={accessToken}
          onClose={handleCloseDialog}
          isOpen={true} 
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={handleOpenServiceForm}
            className="cursor-pointer py-3 flex items-center"
          >
            <Users className="mr-2 h-4 w-4 text-blue-600" />
            <span>Thêm nhân viên dịch vụ</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleOpenLaundryForm}
            className="cursor-pointer py-3 flex items-center"
          >
            <Shirt className="mr-2 h-4 w-4 text-green-600" />
            <span>Thêm nhân viên giặt sấy</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default StaffActionDropdown;
