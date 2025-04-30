import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, Variants } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { EyeIcon, ClipboardListIcon } from "lucide-react";
import { StaffDetails } from "./types";
import StaffDetailDialog from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-detail/StaffDetailPopup";
import StaffOrdersPopup from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-detail/StaffOrdersView";

export const getStatusColor = (status: string | undefined) => {
  const statusLower = status?.toLowerCase() || '';
  
  switch (statusLower) {
    case "active":
    case "ready":
    case "online":
    case "sẵn sàng":
      return "bg-green-500";
    case "away":
      return "bg-yellow-500";
    case "offline":
    case "unavailable":
      return "bg-gray-500";
    case "busy":
    case "working":
    case "bận":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

export const translateStatus = (status: string | undefined) => {
  const statusLower = status?.toLowerCase() || '';
  
  switch (statusLower) {
    case "ready":
    case "online":
      return "Sẵn sàng";
    case "busy":
    case "working":
      return "Bận";
    case "offline":
    case "unavailable":
      return "Offline";
    case "away":
      return "Vắng mặt";
    default:
      return status || "Không xác định";
  }
};

interface StaffListItemProps {
  staff: StaffDetails;
  itemVariants: Variants;
}

const StaffListItem: React.FC<StaffListItemProps> = ({ staff, itemVariants }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  const displayName = staff.name || `Nhân viên ${staff.id.substring(0, 6)}`;
  const displayEmail = staff.email || `staff${staff.id.substring(0, 4)}@example.com`;
  const displayRole = staff.role || "Chức vụ: Nhân viên";
  const displayStatus = translateStatus(staff.status);
  
  // Ensure we have a valid date for lastUpdated
  const lastUpdatedDate = staff.lastUpdated ? new Date(staff.lastUpdated) : new Date();
  const isValidDate = !isNaN(lastUpdatedDate.getTime());
  
  return (
    <>
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition duration-300"
      >
        <div className="flex items-center space-x-6">
          <Avatar>
            <AvatarImage src={staff.avatar} alt={displayName} />
            <AvatarFallback>
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
              <Badge className={`text-white ${getStatusColor(staff.status)}`}>{displayStatus}</Badge>
            </div>
            <p className="text-sm text-gray-600">{displayEmail}</p>
            <p className="text-xs text-gray-500">{displayRole}</p>
            <div className="text-xs text-gray-400 mt-1">
              Đã làm việc{" "}
              {isValidDate ? formatDistanceToNow(lastUpdatedDate, {
                addSuffix: true,
                locale: vi,
              }) : "không rõ"}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDetailOpen(true)}
              className="flex items-center space-x-1 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <EyeIcon size={16} />
              <span>Chi tiết</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOrdersOpen(true)}
              className="flex items-center space-x-1 hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors"
            >
              <ClipboardListIcon size={16} />
              <span>Đơn hàng</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <StaffDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        staffId={staff.id}
        originalStatus={staff.status}
      />

      <StaffOrdersPopup
        isOpen={isOrdersOpen}
        onOpenChange={setIsOrdersOpen}
        staffId={staff.id}
        staffName={displayName}
      />
    </>
  );
};

export default StaffListItem;