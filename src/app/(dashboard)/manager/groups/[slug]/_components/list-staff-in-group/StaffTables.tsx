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
      // Step 1: Get all staff info first
      const staffsResponse = await getAllStaffs();
      const staffsInfo = staffsResponse.payload.items || [];
      
      console.log("Staff Info from API:", staffsInfo);
      
      // Create a mapping of staff ID to staff info
      const staffInfoMapping = staffsInfo.reduce((map: Record<string, any>, staff: any) => {
        map[staff.id] = staff;
        return map;
      }, {});
      
      setStaffInfoMap(staffInfoMapping);

      // Step 2: Get status for all staff
      const allStaffStatusResponse = await getAllStaffStatus(slug);
      const allStaff = Array.isArray(allStaffStatusResponse) ? allStaffStatusResponse : [];
      setAllStaffStatus(allStaff);
      
      console.log("All Staff Status from API:", allStaff);

      // Step 3: Get status for ready staff
      const readyStaffStatusResponse = await getAllStaffStatusReady(slug);
      const readyStaff = Array.isArray(readyStaffStatusResponse) ? readyStaffStatusResponse : [];
      setReadyStaffStatus(readyStaff);
      
      console.log("Ready Staff Status from API:", readyStaff);

      // Step 4: Combine data to create staff details
      const staffDetails = allStaff.map((staffStatus: StaffStatus) => {
        const staffInfo = staffInfoMapping[staffStatus.id];
        
        return {
          id: staffStatus.id,
          name: staffStatus.fullName || staffInfo?.fullName || `Staff ${staffStatus.id.substring(0, 6)}`,
          email: staffInfo?.email || `staff${staffStatus.id.substring(0, 4)}@example.com`,
          role: staffInfo?.jobPosition ? `Chức vụ: ${staffInfo.jobPosition}` : "Chức vụ: Nhân viên",
          status: staffStatus.status || "offline",
          lastUpdated: staffStatus.lastUpdated || new Date().toISOString(),
          avatar: staffInfo?.avatar || "",
          phoneNumber: staffStatus.phoneNumber || staffInfo?.phoneNumber || "",
          gender: staffInfo?.gender || "",
          address: staffInfo?.address || "",
        };
      });

      console.log("Processed Staff Details:", staffDetails);
      
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
      // Try to find this staff in the already processed data
      const staffDetail = staffData.find(
        (staff) => staff.id === readyStaff.id
      );
      
      if (staffDetail) {
        return {
          ...staffDetail,
          status: readyStaff.status || staffDetail.status
        };
      }
      
      // If not found, create a new detail object
      const staffInfo = staffInfoMap[readyStaff.id];
      return {
        id: readyStaff.id,
        name: readyStaff.fullName || staffInfo?.fullName || `Staff ${readyStaff.id.substring(0, 6)}`,
        email: staffInfo?.email || `staff${readyStaff.id.substring(0, 4)}@example.com`,
        role: staffInfo?.jobPosition ? `Chức vụ: ${staffInfo.jobPosition}` : "Chức vụ: Nhân viên",
        status: readyStaff.status || "ready",
        lastUpdated: readyStaff.lastUpdated || new Date().toISOString(),
        avatar: staffInfo?.avatar || "",
        phoneNumber: readyStaff.phoneNumber || staffInfo?.phoneNumber || "",
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