"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Shirt } from "lucide-react";
import { CredenzaCreateServiceStaff } from "@/app/(dashboard)/admin/staffs/_components/credenza-create-service-staff";
import { CredenzaCreateLaudryStaff } from "@/app/(dashboard)/admin/staffs/_components/credenza-create-laundry-staff";
import { useRouter } from "next/navigation";

type StaffActionButtonsProps = {
  accessToken?: string;
};

const StaffActionButtons = ({ accessToken }: StaffActionButtonsProps) => {
  const [activeDialog, setActiveDialog] = useState<"service" | "laundry" | null>(null);
  const router = useRouter();

  const handleOpenServiceForm = () => {
    setActiveDialog("service");
  };

  const handleOpenLaundryForm = () => {
    setActiveDialog("laundry");
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
    // Refresh UI when dialog closes
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

      <div className="flex space-x-3">
        <Button 
          onClick={handleOpenServiceForm}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          Thêm nhân viên dịch vụ
        </Button>

        <Button 
          onClick={handleOpenLaundryForm}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Shirt className="mr-2 h-4 w-4" />
          Thêm nhân viên giặt sấy
        </Button>
      </div>
    </>
  );
};

export default StaffActionButtons;