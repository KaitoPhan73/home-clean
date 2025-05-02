/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  Shield,
  UserCheck,
  XCircle,
  Info,
} from "lucide-react";
import { getStaffById } from "@/apis/staff";
import { TStaffResponse } from "@/schema/staff.schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { formattedDateTime } from "@/lib/formatter";

interface StaffDetailPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  staffName: string;
}

const StaffDetailPopup = ({ isOpen, onOpenChange, staffId, staffName }: StaffDetailPopupProps) => {
  const [staffData, setStaffData] = useState<TStaffResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStaffData();
    }
  }, [isOpen, staffId]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStaffById(staffId);
      setStaffData(response.payload);
    } catch (err) {
      setError("Không thể tải thông tin nhân viên. Vui lòng thử lại sau.");
      console.error("Error fetching staff details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-t-xl">
          <DialogTitle className="text-xl font-semibold flex items-center text-white m-0 p-0">
            <User className="mr-2" size={20} />
            Chi Tiết Nhân Viên - {staffName}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <ScrollArea className="max-h-[calc(90vh-8rem)] min-h-0 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin nhân viên...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-16 text-red-500">
              <XCircle size={48} />
              <p className="mt-4">{error}</p>
              <Button
                onClick={fetchStaffData}
                className="mt-4"
                variant="default"
              >
                Thử Lại
              </Button>
            </div>
          ) : staffData ? (
            <div className="space-y-6">
              {/* First Grid: Profile Card (3 cols) + Personal Info (4 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <div className="md:col-span-3">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {staffData.fullName.split(" ").pop()?.charAt(0) || staffData.fullName.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-center text-gray-800">{staffData.fullName}</h3>
                      <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Briefcase size={14} className="mr-1" />
                        {staffData.jobPosition}
                      </span>
                      <div className="mt-3 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            staffData.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {staffData.status === "Active" ? (
                            <UserCheck size={14} className="mr-1" />
                          ) : (
                            <XCircle size={14} className="mr-1" />
                          )}
                          {staffData.status === "Active" ? "Đang Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                      <div className="w-full mt-4 pt-4 border-t border-blue-100">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Shield size={14} className="mr-1 text-blue-500" />
                            Mã Nhân Viên:
                          </span>
                          <span className="font-medium text-gray-800">{staffData.code}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Info size={18} className="mr-2 text-blue-600" />
                      Thông Tin Cá Nhân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Họ và Tên</label>
                        <div className="flex items-center">
                          <User size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">{staffData.fullName}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Giới Tính</label>
                        <div className="flex items-center">
                          <User size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">
                            {staffData.gender === "Male"
                              ? "Nam"
                              : staffData.gender === "Female"
                              ? "Nữ"
                              : "Khác"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Số Điện Thoại</label>
                        <div className="flex items-center">
                          <Phone size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">{staffData.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Email</label>
                        <div className="flex items-center">
                          <Mail size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">{staffData.email}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Ngày Sinh</label>
                        <div className="flex items-center">
                          <Calendar size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">
                            {formatDate(staffData.dateOfBirth)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Địa Chỉ</label>
                        <div className="flex items-center">
                          <MapPin size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">{staffData.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Grid: Job Info (3 cols) + System Info (4 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <div className="md:col-span-3">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase size={18} className="mr-2 text-blue-600" />
                      Thông Tin Công Việc
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500">Vị Trí Công Việc</label>
                        <div className="flex items-center mt-1">
                          <Briefcase size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">{staffData.jobPosition}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500">Ngày Tuyển Dụng</label>
                        <div className="flex items-center mt-1">
                          <Calendar size={16} className="text-blue-600 mr-2" />
                          <span className="text-gray-800 font-medium">
                            {formatDate(staffData.hireDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500">Trạng Thái</label>
                        <div className="flex items-center mt-1">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                              staffData.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {staffData.status === "Active" ? (
                              <UserCheck size={14} className="mr-1" />
                            ) : (
                              <XCircle size={14} className="mr-1" />
                            )}
                            {staffData.status === "Active" ? "Đang Hoạt Động" : "Không Hoạt Động"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock size={18} className="mr-2 text-indigo-600" />
                      Thông Tin Hệ Thống
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500">Ngày Tạo</label>
                        <div className="flex items-center mt-1">
                          <Calendar size={16} className="text-indigo-600 mr-2" />
                          <span className="text-gray-800 font-medium">{formattedDateTime(staffData.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500">Cập Nhật Lần Cuối</label>
                        <div className="flex items-center mt-1">
                          <Clock size={16} className="text-indigo-600 mr-2" />
                          <span className="text-gray-800 font-medium">{formattedDateTime(staffData.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-gray-500">
              <XCircle size={48} />
              <p className="mt-4">Không tìm thấy thông tin nhân viên</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailPopup;