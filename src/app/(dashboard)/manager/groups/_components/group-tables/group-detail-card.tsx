/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
  Info,
} from "lucide-react";
import { TGroupResponse } from "@/schema/group.schema";
import { useRouter } from "next/navigation";
import { fetchGroupDetails } from "@/app/(dashboard)/manager/groups/_components/group-tables/group-api";

interface GroupDetailsViewProps {
  data: TGroupResponse[] | null;
  onViewMembers?: (groupId: string) => void;
}

const GroupDetailsView: React.FC<GroupDetailsViewProps> = ({
  data,
  onViewMembers,
}) => {
  const router = useRouter();
  const [areaName, setAreaName] = useState<string>("Chưa xác định");
  const [managerName, setManagerName] = useState<string>("Chưa xác định");
  const [clusterNames, setClusterNames] = useState<string[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      const group = data[0];
      setLoading(true);
      const details = await fetchGroupDetails(group);
      setAreaName(details.areaName);
      setManagerName(details.managerName);
      setClusterNames(details.clusterNames);
      setServiceNames(details.serviceNames);
      setLoading(false);
    };
    loadDetails();
  }, [data]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center text-gray-500">
          Đang tải thông tin nhóm...
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center text-gray-500">
          Không có thông tin nhóm
        </CardContent>
      </Card>
    );
  }

  const groupData = data[0];
  const statusVariant =
    groupData.status === "Active" ? "default" : "destructive";
  const statusText =
    groupData.status === "Active" ? "Hoạt động" : "Không hoạt động";

  const handleViewMembers = () => {
    if (onViewMembers) {
      onViewMembers(groupData.id);
    } else {
      router.push(`/manager/groups/${groupData.id}`);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-6 shadow-md border border-blue-100">
        <CardHeader className="bg-blue-50 p-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-9 h-9 text-blue-600" />
              <span className="text-xl font-semibold">
                {groupData.name || "Tên nhóm không xác định"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={statusVariant} className="px-2 py-1">
                {statusText}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={handleViewMembers}
                title="Xem thành viên"
              >
                <User className="w-6 h-6" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <Tag className="w-7 h-7 text-blue-500" />
            <div>
              <p className="text-xl text-gray-600">Mã Nhóm</p>
              <p className="text-xl font-semibold">
                {groupData.code || "Không có"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <UserCheck className="w-7 h-7 text-indigo-500" />
            <div>
              <p className="text-xl text-gray-600">Quản Lý</p>
              <p className="text-xl font-semibold">{managerName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <Calendar className="w-7 h-7 text-green-500" />
            <div>
              <p className="text-xl text-gray-600">Ngày Tạo</p>
              <p className="text-xl font-semibold">
                {formatDate(groupData.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <Clock className="w-7 h-7 text-purple-500" />
            <div>
              <p className="text-xl text-gray-600">Ngày Cập Nhật</p>
              <p className="text-xl font-semibold">
                {formatDate(groupData.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-6 shadow-md border border-orange-100">
        <CardHeader className="bg-orange-50 p-3">
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-9 h-9 text-orange-600" />
            <span className="text-xl font-semibold">Chi Tiết Nhóm</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <MapPin className="w-7 h-7 text-red-500" />
            <div>
              <p className="text-xl text-gray-600">Khu Vực</p>
              <p className="text-xl font-semibold">{areaName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <Building className="w-9 h-9 text-teal-500" />
            <div>
              <p className="text-xl text-gray-600">Dịch Vụ</p>
              <p className="text-xl font-semibold">
                {serviceNames.join(", ") || "Chưa xác định"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <Users className="w-9 h-9 text-orange-500" />
            <div>
              <p className="text-xl text-gray-600">Cụm Nhóm</p>
              <p className="text-xl font-semibold">
                {clusterNames.join(", ") || "Chưa xác định"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupDetailsView;