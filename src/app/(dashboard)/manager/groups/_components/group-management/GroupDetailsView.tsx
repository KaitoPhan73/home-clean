"use client"

import { useState, useEffect } from "react";
import { getAreaById } from "@/apis/area";
import { getManagerById } from "@/apis/manager";
import { getClusterById } from "@/apis/cluster";
import { getServiceById } from "@/apis/service";
import { getAllStaffStatus, getAllStaffStatusReady, reloadAllStaffStatus } from "@/apis/staff";
import { TGroupResponse } from "@/schema/group.schema";
import { TAreaResponse } from "@/schema/area.schema";
import { TManagerResponse } from "@/schema/manager.schema";
import { TClusterResponse } from "@/schema/cluster.schema";
import { TServiceResponse } from "@/schema/service.schema";
import { Users, Info, AlertCircle, Bookmark } from "lucide-react";
import GroupHeader from "./GroupHeader";
import StaffTab from "@/app/(dashboard)/manager/groups/_components/group-management/StaffTab";
import EnhancedOverviewTab from "@/app/(dashboard)/manager/groups/_components/group-management/OverviewTab";

interface Staff {
  id: string;
  status: "Ready" | "Offline";
  lastUpdated: string;
  fullName: string;
  phoneNumber: string;
}

interface GroupDetailsViewProps {
  data: (TGroupResponse & { userId: string | null })[];
}

const GroupDetailsView = ({ data }: GroupDetailsViewProps) => {
  const group = data[0] || null;
  const [areaInfo, setAreaInfo] = useState<TAreaResponse | null>(null);
  const [managerInfo, setManagerInfo] = useState<TManagerResponse | null>(null);
  const [clusterInfo, setClusterInfo] = useState<TClusterResponse[]>([]);
  const [serviceInfo, setServiceInfo] = useState<TServiceResponse[]>([]);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reloadMessage, setReloadMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!group) {
        setLoading(false);
        return;
      }

      try {
        if (group.areaId) {
          const areaResponse = await getAreaById(group.areaId);
          if (areaResponse?.payload) {
            setAreaInfo(areaResponse.payload);
          }
        }

        if (group.managerId) {
          const managerResponse = await getManagerById(group.managerId);
          if (managerResponse?.payload) {
            setManagerInfo(managerResponse.payload);
          }
        }

        if (group.clusterIds && group.clusterIds.length > 0) {
          const clusterPromises = group.clusterIds.map((id: string) => getClusterById(id));
          const clusterResponses = await Promise.all(clusterPromises);
          const validClusters = clusterResponses
            .filter((response) => response?.payload)
            .map((response) => response.payload);
          setClusterInfo(validClusters);
        }

        if (group.serviceIds && group.serviceIds.length > 0) {
          const servicePromises = Array.isArray(group.serviceIds)
            ? group.serviceIds.map((id: string) => getServiceById(id))
            : [];
          const serviceResponses = await Promise.all(servicePromises);
          const validServices = serviceResponses
            .filter((response) => response?.payload)
            .map((response) => response.payload);
          setServiceInfo(validServices);
        }

        if (group.id) {
          const staffResponse = await getAllStaffStatus(group.id);
          const normalizedStaff = Array.isArray(staffResponse) ? staffResponse : [];
          setStaffData(normalizedStaff as Staff[]);
        }
      } catch (error) {
        console.error("Error fetching related data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [group]);

  const handleReloadStaffStatus = async () => {
    if (!group?.id) return;
    setStaffLoading(true);
    try {
      await reloadAllStaffStatus(group.id);
      const staffResponse = await getAllStaffStatusReady(group.id);
      const normalizedStaff = Array.isArray(staffResponse) ? staffResponse : [];
      setStaffData(normalizedStaff as Staff[]);
      setReloadMessage("Tải lại trạng thái nhân viên thành công!");
      setTimeout(() => setReloadMessage(null), 3000);
    } catch (error) {
      console.error("Error reloading staff status:", error);
      setReloadMessage("Lỗi khi tải lại trạng thái nhân viên!");
      setTimeout(() => setReloadMessage(null), 3000);
    } finally {
      setStaffLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-indigo-600 font-medium text-lg">Đang tải thông tin nhóm...</span>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center p-10 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-md">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-red-800">Không Có Dữ Liệu Nhóm</h3>
          <p className="text-red-600 max-w-md mx-auto">Không tìm thấy dữ liệu nhóm nào để hiển thị. Vui lòng kiểm tra lại thông tin hoặc thêm nhóm mới.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Tổng Quan", icon: <Info size={20} className="text-indigo-500" /> },
    { id: "staff", label: "Nhân Viên", icon: <Users size={20} className="text-indigo-500" /> },
  ];

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex overflow-x-auto border-b scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <div className={`mr-2 ${activeTab === tab.id ? "animate-pulse" : ""}`}>{tab.icon}</div>
              {tab.label}
              {tab.id === "staff" && staffData.length > 0 && (
                <div className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full px-2 py-0.5">
                  {staffData.length}
                </div>
              )}
            </button>
          ))}
        </div>
        
        {reloadMessage && (
          <div className={`p-3 text-sm font-medium ${
            reloadMessage.includes("thành công") 
              ? "bg-green-50 text-green-700 border-b border-green-200"
              : "bg-red-50 text-red-700 border-b border-red-200"
          }`}>
            <div className="flex items-center justify-center">
              {reloadMessage.includes("thành công") ? (
                <Bookmark size={16} className="mr-2" />
              ) : (
                <AlertCircle size={16} className="mr-2" />
              )}
              {reloadMessage}
            </div>
          </div>
        )}
        
        <div className="p-6">
          {activeTab === "overview" && (
            <EnhancedOverviewTab
              group={group}
              areaInfo={areaInfo}
              managerInfo={managerInfo}
              clusters={clusterInfo}
              services={serviceInfo}
            />
          )}
          {activeTab === "staff" && (
            <StaffTab
              staffData={staffData}
              onReload={handleReloadStaffStatus}
              loading={staffLoading}
              message={reloadMessage}
              groupId={group.id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsView;