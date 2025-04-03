/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// StaffTables.tsx (Main Container Component)
"use client";

import React, { useEffect, useState } from "react";
import { getAllStaffStatus, getAllStaffStatusReady, getAllStaffs } from "@/apis/staff";
import { StaffDetails, StaffStatus } from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/types";
import StaffList from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/StaffList";
import ReadyStaffList from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/ReadyStaffList";

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
  const [staffInfoMap, setStaffInfoMap] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const staffsResponse = await getAllStaffs();
      const staffsInfo = staffsResponse.payload.items || [];
      
      const staffInfoMapping = staffsInfo.reduce((map: Record<string, any>, staff: any) => {
        map[staff.id] = staff;
        return map;
      }, {});
      
      setStaffInfoMap(staffInfoMapping);

      const allStaff = await getAllStaffStatus(slug);
      setAllStaffStatus(Array.isArray(allStaff) ? allStaff : []);

      const readyStaff = await getAllStaffStatusReady(slug);
      setReadyStaffStatus(Array.isArray(readyStaff) ? readyStaff : []);

      const staffDetails = Array.isArray(allStaff)
        ? allStaff.map((staff: StaffStatus) => {
            const staffInfo = staffInfoMapping[staff.id];
            return {
              id: staff.id,
              name: staffInfo?.fullName || `Staff ${staff.id.substring(0, 6)}`,
              email: staffInfo?.email || `staff${staff.id.substring(0, 4)}@example.com`,
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

  const getReadyStaffDetails = () => {
    return readyStaffStatus.map((readyStaff) => {
      const staffDetail = staffData.find(
        (staff) => staff.id === readyStaff.id
      );
      
      if (staffDetail) {
        return staffDetail;
      }
      
      const staffInfo = staffInfoMap[readyStaff.id];
      return {
        id: readyStaff.id,
        name: staffInfo?.fullName || `Staff ${readyStaff.id.substring(0, 6)}`,
        email: staffInfo?.email || `staff${readyStaff.id.substring(0, 4)}@example.com`,
        role: `Chức vụ: ${staffInfo?.jobPosition}` || "Nhân viên",
        status: readyStaff.status,
        lastUpdated: readyStaff.lastUpdated,
        phoneNumber: staffInfo?.phoneNumber || "",
        gender: staffInfo?.gender || "",
        address: staffInfo?.address || "",
      };
    });
  };

  const readyStaffDetails = getReadyStaffDetails();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-[70%]">
        <StaffList
          staffData={filteredStaff}
          totalStaff={staffData.length}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="w-full md:w-[30%]">
        <ReadyStaffList
          readyStaffDetails={readyStaffDetails}
          readyStaffCount={readyStaffStatus.length}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default StaffTables;