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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ClipboardCheck, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: {
    id: string;
    taskName: string;
    status: string;
  };
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      // Delete task logic would go here
      toast.success("Nhiệm vụ đã được xóa thành công");
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa nhiệm vụ");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleCompleteTask = async () => {
    try {
      // Complete task logic would go here
      toast.success(`Nhiệm vụ "${data.taskName}" đã được đánh dấu hoàn thành`);
      router.refresh();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi hoàn thành nhiệm vụ");
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
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/admin/tasks/${data.id}`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-blue-500" /> 
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
          
          {data.status !== "Completed" && (
            <DropdownMenuItem 
              onClick={handleCompleteTask}
              className="cursor-pointer"
            >
              <ClipboardCheck className="mr-2 h-4 w-4 text-green-500" /> 
              <span>Đánh dấu hoàn thành</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => setOpen(true)}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" /> 
            <span>Xóa nhiệm vụ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};