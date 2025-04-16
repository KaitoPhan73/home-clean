/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Tag,
  Calendar,
  Clock,
  Building,
  UserCheck,
  MapPin,
  Info,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { TGroupResponse } from "@/schema/group.schema";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { fetchGroupDetails } from "@/app/(dashboard)/manager/groups/_components/group-tables/group-api";
import {
  getAllStaffStatus,
  getAllStaffStatusReady,
  getAllStaffs,
  reloadAllStaffStatus,
} from "@/apis/staff";
import { motion, AnimatePresence } from "framer-motion";
import {
  StaffDetails,
  StaffStatus,
} from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/types";
import ReadyStaffList from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/ReadyStaffList";
import StaffList from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/StaffList";

interface GroupDetailsViewProps {
  data: TGroupResponse[] | null;
}

const GroupDetailsView: React.FC<GroupDetailsViewProps> = ({ data }) => {
  const router = useRouter();
  const [areaName, setAreaName] = useState<string>("Chưa xác định");
  const [managerName, setManagerName] = useState<string>("Chưa xác định");
  const [clusterNames, setClusterNames] = useState<string[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reloadingStaff, setReloadingStaff] = useState<boolean>(false);
  const [showStaffSection, setShowStaffSection] = useState<boolean>(true); // Default to true

  // Staff data states
  const [allStaffStatus, setAllStaffStatus] = useState<StaffStatus[]>([]);
  const [readyStaffStatus, setReadyStaffStatus] = useState<StaffStatus[]>([]);
  const [staffData, setStaffData] = useState<StaffDetails[]>([]);
  const [staffInfoMap, setStaffInfoMap] = useState<Record<string, any>>({});
  const [staffLoading, setStaffLoading] = useState<boolean>(true);
  const [staffRefreshing, setStaffRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredStaff, setFilteredStaff] = useState<StaffDetails[]>([]);
  const staffSectionRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Không có";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Ngày không hợp lệ";
    }
  };

  useEffect(() => {
    const loadDetails = async () => {
      if (!data || !data[0]) {
        setLoading(false);
        return;
      }

      try {
        const details = await fetchGroupDetails(data[0]);
        setAreaName(details.areaName);
        setManagerName(details.managerName);
        setClusterNames(details.clusterNames);
        setServiceNames(details.serviceNames);
      } catch (error) {
        console.error("Error loading group details:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin chi tiết nhóm",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [data]);

  const loadStaffData = async () => {
    if (!data || !data[0]) return;
    setStaffLoading(true);

    try {
      const staffsResponse = await getAllStaffs();
      const staffsInfo = staffsResponse.payload.items || [];
      const staffInfoMapping = staffsInfo.reduce(
        (map: Record<string, any>, staff: any) => {
          map[staff.id] = staff;
          return map;
        },
        {}
      );

      setStaffInfoMap(staffInfoMapping);

      const allStaff = await getAllStaffStatus(data[0].id);
      setAllStaffStatus(Array.isArray(allStaff) ? allStaff : []);

      const readyStaff = await getAllStaffStatusReady(data[0].id);
      setReadyStaffStatus(Array.isArray(readyStaff) ? readyStaff : []);

      const staffDetails = Array.isArray(allStaff)
        ? allStaff.map((staff: StaffStatus) => {
            const staffInfo = staffInfoMapping[staff.id];
            return {
              id: staff.id,
              name: staffInfo?.fullName || `Staff ${staff.id.substring(0, 6)}`,
              email:
                staffInfo?.email ||
                `staff${staff.id.substring(0, 4)}@example.com`,
              role: `Chức vụ: ${staffInfo?.jobPosition}` || "Nhân viên",
              status: staff.status,
              lastUpdated: staff.lastUpdated,
              avatar: staffInfo?.avatar || "",
              phoneNumber: staffInfo?.phoneNumber || "",
              gender: staffInfo?.gender || "",
              address: staffInfo?.address || "",
            };
          })
        : [];

      setStaffData(staffDetails);
      setFilteredStaff(staffDetails);
    } catch (error) {
      console.error("Error loading staff data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin nhân viên",
      });
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    if (data && data[0]) {
      loadStaffData();
    }
  }, [data]);

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

  const getReadyStaffDetails = () => {
    return readyStaffStatus.map((readyStaff) => {
      const staffDetail = staffData.find((staff) => staff.id === readyStaff.id);

      if (staffDetail) {
        return staffDetail;
      }

      const staffInfo = staffInfoMap[readyStaff.id];
      return {
        id: readyStaff.id,
        name: staffInfo?.fullName || `Staff ${readyStaff.id.substring(0, 6)}`,
        email:
          staffInfo?.email ||
          `staff${readyStaff.id.substring(0, 4)}@example.com`,
        role: `Chức vụ: ${staffInfo?.jobPosition}` || "Nhân viên",
        status: readyStaff.status,
        lastUpdated: readyStaff.lastUpdated,
        phoneNumber: staffInfo?.phoneNumber || "",
        gender: staffInfo?.gender || "",
        address: staffInfo?.address || "",
      };
    });
  };

  const handleReloadStaffStatus = async () => {
    if (!data || !data[0]) return;

    setReloadingStaff(true);

    try {
      const success = await reloadAllStaffStatus(data[0].id);

      if (success) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trạng thái nhân viên",
        });
        handleRefreshStaff();
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể cập nhật trạng thái nhân viên",
        });
      }
    } catch (error) {
      console.error("Error reloading staff status:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật trạng thái nhân viên",
      });
    } finally {
      setReloadingStaff(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleRefreshStaff = () => {
    setStaffRefreshing(true);
    loadStaffData().finally(() => {
      setStaffRefreshing(false);
    });
  };

  const handleToggleStaffSection = () => {
    setShowStaffSection((prev) => {
      const newShowStaffSection = !prev;
      if (newShowStaffSection && staffSectionRef.current) {
        setTimeout(() => {
          staffSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return newShowStaffSection;
    });
  };

  const readyStaffDetails = getReadyStaffDetails();

  if (!data || data.length === 0) {
    return (
      <Card className="w-full shadow-md border border-gray-200">
        <CardContent className="p-4 text-center">
          <Info className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-500">
            Không có thông tin nhóm
          </h3>
          <p className="text-gray-400 mt-1">
            Vui lòng kiểm tra lại hoặc tạo nhóm mới
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupData = data[0];
  const statusVariant =
    groupData.status === "Active" ? "default" : "destructive";
  const statusText =
    groupData.status === "Active" ? "Hoạt động" : "Không hoạt động";

  return (
    <div className="space-y-4">
      <Card className="w-full shadow-md border border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900">
                  {groupData.name || "Tên nhóm không xác định"}
                </h2>
                <div className="flex items-center space-x-2">
                  <Tag className="w-3 h-3 text-blue-500" />
                  <span className="text-blue-600 font-medium text-xs">
                    {groupData.code || "Không có mã"}
                  </span>
                  <Badge
                    variant={statusVariant}
                    className="ml-1 px-1.5 py-0.5 text-xs"
                  >
                    {statusText}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                onClick={handleToggleStaffSection}
                className={`${
                  showStaffSection
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } flex items-center gap-1 whitespace-nowrap`}
                size="sm"
              >
                {showStaffSection ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Ẩn thành viên</span>
                    <span className="inline sm:hidden">Ẩn</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Xem thành viên</span>
                    <span className="inline sm:hidden">Xem</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleReloadStaffStatus}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-1 whitespace-nowrap"
                disabled={reloadingStaff}
              >
                {reloadingStaff ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span className="hidden md:inline">Làm mới trạng thái</span>
                <span className="inline md:hidden">Làm mới</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 flex justify-center items-center h-24">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mb-1" />
                <p className="text-gray-500 text-sm">
                  Đang tải thông tin chi tiết...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Compact info grid with improved styling */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-blue-50 p-2.5 rounded-md border border-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-1">
                    <UserCheck className="w-4 h-4 text-indigo-600 mr-1.5" />
                    <p className="text-xs font-medium text-indigo-800">
                      Quản lý
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {managerName}
                  </p>
                </div>

                <div className="bg-red-50 p-2.5 rounded-md border border-red-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-1">
                    <MapPin className="w-4 h-4 text-red-600 mr-1.5" />
                    <p className="text-xs font-medium text-red-800">Khu vực</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {areaName}
                  </p>
                </div>

                <div className="bg-green-50 p-2.5 rounded-md border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 text-green-600 mr-1.5" />
                    <p className="text-xs font-medium text-green-800">
                      Ngày tạo
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {formatDate(groupData.createdAt)}
                  </p>
                </div>

                <div className="bg-purple-50 p-2.5 rounded-md border border-purple-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 text-purple-600 mr-1.5" />
                    <p className="text-xs font-medium text-purple-800">
                      Cập nhật cuối
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {formatDate(groupData.updatedAt)}
                  </p>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-2">
                    <Users className="w-4 h-4 text-blue-600 mr-1.5" />
                    <p className="text-xs font-medium text-blue-800">
                      Cụm nhóm
                    </p>
                  </div>
                  {clusterNames && clusterNames.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {clusterNames.map((name, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-100 text-blue-700 border-blue-200 text-xs py-0.5 px-2"
                        >
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-500 italic">
                      Chưa xác định
                    </p>
                  )}
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 text-teal-600 mr-1.5" />
                    <p className="text-xs font-medium text-teal-800">Dịch vụ</p>
                  </div>
                  {serviceNames && serviceNames.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {serviceNames.map((name, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-teal-100 text-teal-700 border-teal-200 text-xs py-0.5 px-2"
                        >
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-500 italic">
                      Chưa xác định
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff section toggle message when hidden */}
      {/* {!showStaffSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-3"
        >
          <div
            onClick={handleToggleStaffSection}
            className="inline-flex flex-col items-center cursor-pointer group"
          >
            <div className="bg-blue-100 hover:bg-blue-200 p-4 rounded-full mb-2 transition-colors">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800 transition-colors">
              Xem thành viên
            </span>
          </div>
        </motion.div>
      )} */}
      {/* Staff section */}
      <AnimatePresence>
        {showStaffSection && (
          <motion.div
            ref={staffSectionRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden debug-staff-section"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <StaffList
                  staffData={filteredStaff}
                  totalStaff={staffData.length}
                  isLoading={staffLoading}
                  isRefreshing={staffRefreshing}
                  searchQuery={searchQuery}
                  statusFilter={statusFilter}
                  onSearchChange={handleSearchChange}
                  onStatusFilterChange={handleStatusFilterChange}
                  onRefresh={handleRefreshStaff}
                />
              </div>
              <div className="lg:col-span-1">
                <ReadyStaffList
                  readyStaffDetails={readyStaffDetails}
                  readyStaffCount={readyStaffDetails.length}
                  isLoading={staffLoading}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupDetailsView;
