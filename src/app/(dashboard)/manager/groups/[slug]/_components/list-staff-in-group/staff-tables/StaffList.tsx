// StaffList.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { StaffDetails } from "./types";
import StaffSearchFilter from "./StaffSearchFilter";
import StaffListItem from "./StaffListItem";

interface StaffListProps {
  staffData: StaffDetails[];
  totalStaff: number;
  isLoading: boolean;
  isRefreshing: boolean;
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
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

const StaffList: React.FC<StaffListProps> = ({
  staffData,
  totalStaff,
  isLoading,
  isRefreshing,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
}) => {
  return (
    <Card className="shadow-md h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle>Danh sách nhân viên</CardTitle>
          <Badge variant="outline" className="px-4 py-2">
            {isLoading ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              `${totalStaff} Nhân viên`
            )}
          </Badge>
        </div>
        <StaffSearchFilter
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          isRefreshing={isRefreshing}
          onSearchChange={onSearchChange}
          onStatusFilterChange={onStatusFilterChange}
          onRefresh={onRefresh}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <StaffListSkeleton />
        ) : (
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y overflow-auto max-h-[calc(100vh-300px)]"
            >
              {staffData.length > 0 ? (
                staffData.map((staff) => (
                  <StaffListItem
                    key={staff.id}
                    staff={staff}
                    itemVariants={itemVariants}
                  />
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="py-12 text-center text-muted-foreground"
                >
                  Không tìm thấy nhân viên phù hợp
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

const StaffListSkeleton = () => (
  <div className="space-y-4">
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4 border-b">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
  </div>
);

export default StaffList;