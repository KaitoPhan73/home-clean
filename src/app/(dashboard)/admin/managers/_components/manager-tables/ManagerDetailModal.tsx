"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Hash, 
  Group, 
  Users,
  RefreshCw
} from "lucide-react";
import { TManagerResponse } from "@/schema/manager.schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getManagerById } from "@/apis/manager";

interface ManagerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerId: string | null;
  initialData?: TManagerResponse | null;
}

export const ManagerDetailModal: React.FC<ManagerDetailModalProps> = ({
  isOpen,
  onClose,
  managerId,
  initialData
}) => {
  const [manager, setManager] = useState<TManagerResponse | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  const fetchManagerData = async () => {
    if (!managerId) return;
    
    try {
      setLoading(true);
      const response = await getManagerById(managerId);
      setManager(response.payload);
    } catch (error) {
      console.error("Error fetching manager details:", error);
    } finally {
      setLoading(false);
    }
  };

  // If we have a managerId but no data, fetch it when the modal opens
  if (managerId && isOpen && !manager && !loading) {
    fetchManagerData();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Thông tin chi tiết quản lý
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="text-gray-500">Đang tải thông tin...</p>
            </div>
          </div>
        ) : manager ? (
          <ScrollArea className="max-h-[calc(80vh-120px)]">
            <div className="grid grid-cols-1 gap-6 mt-4 pr-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{manager.fullName}</h3>
                    <div className="flex items-center mt-1">
                      <Hash className="text-gray-500 h-4 w-4 mr-1" />
                      <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {manager.code}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={manager.status === "Active" 
                  ? "bg-green-100 text-green-800 border-green-300" 
                  : "bg-red-100 text-red-800 border-red-300"}>
                  <div className="flex items-center gap-1">
                    {manager.status === "Active" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span>{manager.status === "Active" ? "Hoạt động" : "Không hoạt động"}</span>
                  </div>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Thông tin liên hệ</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="text-green-500 h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{manager.phoneNumber || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="text-purple-500 h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium break-words">{manager.email || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Thông tin nhóm</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Group className="text-indigo-500 h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Tên nhóm</p>
                        <p className="font-medium">{manager.groupName || "Chưa có nhóm"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Hash className="text-gray-500 h-5 w-5 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Mã nhóm</p>
                        <p className="font-medium font-mono text-sm break-all">
                          {manager.groupId || "Chưa có mã nhóm"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Thời gian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-500 h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày tạo</p>
                      <p className="font-medium">{formatDate(manager.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-orange-500 h-5 w-5 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                      <p className="font-medium">{formatDate(manager.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {manager.staffNames && manager.staffNames.length > 0 && (
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="text-teal-500 h-5 w-5" />
                      <span>Nhân viên ({manager.staffNames.length})</span>
                    </div>
                  </h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {manager.staffNames.map((staffName, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 rounded bg-gray-50">
                        <div className="bg-teal-100 p-1.5 rounded-full">
                          <User className="text-teal-600 h-4 w-4" />
                        </div>
                        <span>{staffName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  className="text-gray-700"
                  onClick={onClose}
                >
                  Đóng
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">Không tìm thấy thông tin quản lý</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchManagerData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tải lại
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};