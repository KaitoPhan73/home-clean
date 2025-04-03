/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  BriefcaseIcon,
  ClockIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TStaffResponse } from "@/schema/staff.schema";
import { getAllStaffs } from "@/apis/staff";
import { getStatusColor } from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/StaffListItem";

export const getStatusText = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
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

const ProfileTabContent: React.FC<{
  staffDetails: TStaffResponse;
  originalStatus?: string;
}> = ({ staffDetails, originalStatus }) => (
  <div className="flex flex-col md:flex-row gap-6">
    <Card className="w-full md:w-3/6 bg-gray-50">
      <CardContent className="p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage
            src="https://media.istockphoto.com/id/1288129985/vi/vec-to/thi%E1%BA%BFu-h%C3%ACnh-%E1%BA%A3nh-c%E1%BB%A7a-tr%C3%ACnh-gi%E1%BB%AF-ch%E1%BB%97-cho-m%E1%BB%99t-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=2mBRPdxj9u08XRt8L9iu-iLgDEV-ts3uqkkG2ReteTw="
            alt={staffDetails.fullName}
          />
          <AvatarFallback className="text-lg">
            {staffDetails.fullName?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold text-center">
          {staffDetails.fullName}
        </h3>
        <Badge className="mt-2" variant="outline">
          {staffDetails.jobPosition}
        </Badge>

        <div className="flex items-center mt-4 text-gray-600">
          <Badge
            className={`${getStatusColor(
              originalStatus || staffDetails.status
            )} mt-1`}
          >
            {originalStatus || staffDetails.status}
          </Badge>
        </div>
      </CardContent>
    </Card>

    <Card className="w-full md:w-3/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3">
            <MailIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{staffDetails.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <PhoneIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p className="font-medium">
                {staffDetails.phoneNumber || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Giới tính</p>
              <p className="font-medium">
                {staffDetails.gender || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ngày sinh</p>
              <p className="font-medium">
                {staffDetails.dateOfBirth
                  ? format(new Date(staffDetails.dateOfBirth), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Địa chỉ</p>
              <p className="font-medium">
                {staffDetails.address || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const WorkTabContent: React.FC<{
  staffDetails: TStaffResponse;
  originalStatus?: string;
}> = ({ staffDetails, originalStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BriefcaseIcon className="w-5 h-5 mr-2" />
          Thông tin công việc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <p className="text-gray-600">Chức vụ:</p>
          <p className="font-medium">{staffDetails.jobPosition}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p className="text-gray-600">Ngày vào làm:</p>
          <p className="font-medium">
            {staffDetails.hireDate
              ? format(new Date(staffDetails.hireDate), "dd/MM/yyyy", {
                  locale: vi,
                })
              : "Chưa cập nhật"}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <ClockIcon className="w-5 h-5 mr-2" />
          Trạng thái làm việc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Trạng thái:</p>
          <Badge
            className={getStatusColor(originalStatus || staffDetails.status)}
          >
            {originalStatus || staffDetails.status}
          </Badge>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p className="text-gray-600">Cập nhật lần cuối:</p>
          <p className="font-medium">
            {staffDetails.updatedAt
              ? format(new Date(staffDetails.updatedAt), "HH:mm - dd/MM/yyyy", {
                  locale: vi,
                })
              : "Chưa cập nhật"}
          </p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p className="text-gray-600">Số đơn hàng đang xử lý:</p>
          <p className="font-medium">{0}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface StaffDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  originalStatus?: string;
}

const StaffDetailDialog: React.FC<StaffDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  staffId,
  originalStatus,
}) => {
  const [staffDetails, setStaffDetails] = useState<TStaffResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllStaffs()
        .then((response) => {
          const staffData = response.payload.items.find(
            (s: any) => s.id === staffId
          );
          setStaffDetails(staffData || null);
        })
        .catch((error) => console.error("Error fetching staff details:", error))
        .finally(() => setLoading(false));
    }
  }, [isOpen, staffId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-xl font-semibold text-center">
            Thông tin chi tiết nhân viên
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
          </div>
        ) : staffDetails ? (
          <Tabs defaultValue="profile" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="work">Công việc & Trạng thái</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="pt-4">
              <ProfileTabContent
                staffDetails={staffDetails}
                originalStatus={originalStatus}
              />
            </TabsContent>

            <TabsContent value="work" className="pt-4">
              <WorkTabContent
                staffDetails={staffDetails}
                originalStatus={originalStatus}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-xl font-medium text-gray-600">
              Không tìm thấy thông tin nhân viên
            </div>
            <Button onClick={() => onOpenChange(false)}>Đóng</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailDialog;
