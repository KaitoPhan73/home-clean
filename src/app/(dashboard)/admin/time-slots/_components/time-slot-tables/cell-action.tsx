/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTimeSlot } from "@/apis/time-slot";
import { useToast } from "@/hooks/use-toast";
import { UpdateTimeSlotCredenza } from "../credenza-update-time-slot";
import { TTimesSlotResponse } from "@/schema/time-slot.schema";
import { handleErrorApi } from "@/lib/utils";

interface CellActionProps {
  data: TTimesSlotResponse;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deleteTimeSlot(data.id);
      toast({
        title: "Xóa thành công",
        description: "Ca làm việc đã được xóa khỏi hệ thống.",
      });
      setOpen(false);
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <UpdateTimeSlotCredenza data={data} />
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
