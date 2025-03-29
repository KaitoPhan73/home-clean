/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getAllStaffStatus, getAllStaffStatusReady } from "@/apis/staff";

interface StaffStatus {
  staffId: string;
  status: string;
  lastUpdated: string;
}

interface StaffDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: string;
  lastUpdated: string;
}

interface Props {
  slug: string;
}

export const StaffTables = ({ slug }: Props) => {
  const [allStaffStatus, setAllStaffStatus] = useState<StaffStatus[]>([]);
  const [readyStaffStatus, setReadyStaffStatus] = useState<StaffStatus[]>([]);
  const [staffData, setStaffData] = useState<StaffDetails[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation variants
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

  const fetchData = async () => {
  try {
    // Gọi API lấy danh sách tất cả nhân viên
    const allStaff = await getAllStaffStatus(slug);
    setAllStaffStatus(Array.isArray(allStaff) ? allStaff : []);

    // Gọi API lấy danh sách nhân viên sẵn sàng
    const readyStaff = await getAllStaffStatusReady(slug);
    setReadyStaffStatus(Array.isArray(readyStaff) ? readyStaff : []);

    // Tạo danh sách nhân viên với thông tin chi tiết
    const staffDetails = Array.isArray(allStaff) ? allStaff.map((staff: StaffStatus) => ({
      id: staff.staffId,
      name: `Staff ${staff.staffId.substring(0, 6)}`,
      email: `staff${staff.staffId.substring(0, 4)}@example.com`,
      role: "Nhân viên",
      status: staff.status,
      lastUpdated: staff.lastUpdated,
    })) : [];

    setStaffData(staffDetails);
    setFilteredStaff(staffDetails);
  } catch (error) {
    console.error("Error fetching staff data:", error);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};


  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    let filtered = [...staffData];

    if (searchQuery) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (staff) => staff.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredStaff(filtered);
  }, [searchQuery, statusFilter, staffData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  // Get ready staff details
  const getReadyStaffDetails = () => {
    return readyStaffStatus.map((readyStaff) => {
      const staffDetail = staffData.find(
        (staff) => staff.id === readyStaff.staffId
      );
      return (
        staffDetail || {
          id: readyStaff.staffId,
          name: `Staff ${readyStaff.staffId.substring(0, 6)}`,
          email: `staff${readyStaff.staffId.substring(0, 4)}@example.com`,
          role: "Nhân viên",
          status: readyStaff.status,
          lastUpdated: readyStaff.lastUpdated,
        }
      );
    });
  };

  const readyStaffDetails = getReadyStaffDetails();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main staff list - 70% width */}
      <div className="w-full md:w-[70%]">
        <Card className="shadow-md h-full">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <CardTitle>Danh sách nhân viên</CardTitle>
              <Badge variant="outline" className="px-4 py-2">
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  `${staffData.length} Nhân viên`
                )}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="ready">Sẵn sàng</SelectItem>
                    <SelectItem value="working">Đang làm việc</SelectItem>
                    <SelectItem value="away">Vắng mặt</SelectItem>
                    <SelectItem value="offline">Ngoại tuyến</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 py-4 border-b"
                    >
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y overflow-auto max-h-[calc(100vh-300px)]"
                >
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <motion.div
                        key={staff.id}
                        variants={itemVariants}
                        className="flex items-center justify-between py-4"
                        layout
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback>
                              {staff.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {staff.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {staff.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(staff.status)} text-white`}
                          >
                            {staff.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(staff.lastUpdated), {
                              addSuffix: true,
                              locale: vi
                            })}
                          </span>
                        </div>
                      </motion.div>
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
      </div>

      {/* Ready staff list - 30% width */}
      <div className="w-full md:w-[30%]">
        <Card className="shadow-md h-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Nhân viên sẵn sàng</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {isLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  readyStaffStatus.length
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 py-3 border-b"
                    >
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
              </div>
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
                      <motion.div
                        key={staff.id}
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
                          <p className="text-xs text-muted-foreground">
                            {staff.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(staff.lastUpdated), {
                              addSuffix: true,
                              locale: vi
                            })}
                          </p>
                        </div>
                      </motion.div>
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
      </div>
    </div>
  );
};

export default StaffTables;