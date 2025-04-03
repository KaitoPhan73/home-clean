// ReadyStaffListItem.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, Variants } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { StaffDetails } from "./types";

interface ReadyStaffListItemProps {
  staff: StaffDetails;
  itemVariants: Variants;
}

const ReadyStaffListItem: React.FC<ReadyStaffListItemProps> = ({
  staff,
  itemVariants,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center space-x-3 py-3"
      layout
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={staff.avatar} />
          <AvatarFallback>
            {staff.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
      </div>
      <div>
        <p className="font-medium text-sm">{staff.name}</p>
        <p className="text-xs text-muted-foreground">{staff.role}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(staff.lastUpdated), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default ReadyStaffListItem;