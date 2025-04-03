// ReadyStaffList.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { StaffDetails } from "./types";
import ReadyStaffListItem from "./ReadyStaffListItem";

interface ReadyStaffListProps {
  readyStaffDetails: StaffDetails[];
  readyStaffCount: number;
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const ReadyStaffList: React.FC<ReadyStaffListProps> = ({
  readyStaffDetails,
  readyStaffCount,
  isLoading,
}) => {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Nhân viên sẵn sàng</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {isLoading ? <Skeleton className="h-4 w-8" /> : readyStaffCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ReadyStaffSkeleton />
        ) : (
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y overflow-auto max-h-[calc(100vh-300px)]"
            >
              {readyStaffDetails.length > 0 ? (
                readyStaffDetails.map((staff) => (
                  <ReadyStaffListItem
                    key={staff.id}
                    staff={staff}
                    itemVariants={itemVariants}
                  />
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="py-8 text-center text-muted-foreground text-sm"
                >
                  Không có nhân viên nào sẵn sàng
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

const ReadyStaffSkeleton = () => (
  <div className="space-y-3">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-3 border-b">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
  </div>
);

export default ReadyStaffList;