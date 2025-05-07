/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Users,
  CheckCircle,
  Edit,
  ChevronDown,
  ChevronRight,
  Activity,
  Info,
  Shield,
  Briefcase,
} from "lucide-react";
import { getManagerById } from "@/apis/manager";
import { TManagerResponse } from "@/schema/manager.schema";
import { formattedDateTime } from "@/lib/formatter";
import UpdateManagerModal from "@/app/(dashboard)/manager/profile/_components/UpdateManagerModal";

export default function ManagerProfilePage() {
  const [manager, setManager] = useState<TManagerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [staffExpanded, setStaffExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUpdateManager = (updatedManager: TManagerResponse) => {
    setManager(updatedManager)
    setIsModalOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        setLoading(true);

        let userRaw = "";
        if (document.cookie) {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("user=")) {
              userRaw = cookie.substring("user=".length, cookie.length);
              break;
            }
          }
        }

        if (!userRaw) {
          userRaw = localStorage.getItem("user") || "";
        }

        if (!userRaw) {
          setError("User information not found");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userRaw);
        const managerId = user.userId;

        const response = await getManagerById(managerId);

        if (response && response.payload) {
          setManager(response.payload);
        } else {
          setError("Manager profile not found");
        }
      } catch (err: any) {
        console.error("Error fetching manager profile:", err);
        setError("Could not load profile information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-blue-600 font-medium text-lg">
            Đang tải thông tin...
          </p>
          <p className="text-blue-400 text-sm mt-2">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center transform transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-red-100 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể tải thông tin
          </h3>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:translate-y-1 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!manager) {
    return null;
  }

  return (
    <div className="h-auto bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Thông tin cá nhân</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg"
            >
              <Edit size={16} />
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`bg-white shadow z-10 transition-all duration-300 ${
          scrollPosition > 100 ? "sticky top-0 shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center space-x-2 border-b-2 transition-all duration-300 ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              <span>Thông tin chung</span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center space-x-2 border-b-2 transition-all duration-300 ${
                activeTab === "team"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("team")}
            >
              <Users size={18} />
              <span>Đội nhóm</span>
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center space-x-2 border-b-2 transition-all duration-300 ${
                activeTab === "activity"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <Activity size={18} />
              <span>Hoạt động</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-130px)]">
        <div className="container mx-auto px-4 py-6 pb-16">
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold mb-3 shadow-lg transform transition-transform hover:scale-105">
                    {manager.fullName.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {manager.fullName}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">{manager.code}</p>
                  <div className="mt-3 bg-green-500/30 rounded-full px-3 py-1 text-sm text-white flex items-center shadow-inner">
                    <CheckCircle size={14} className="mr-1" />
                    {manager.status ?? "N/A"}
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid gap-4">
                    <div className="flex items-start group">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-all duration-300">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{manager.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-all duration-300">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{manager.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-all duration-300">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nhóm</p>
                        <p className="font-medium">
                          {manager.groupName ?? "Chưa phân nhóm"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start group">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-all duration-300">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vai trò</p>
                        <p className="font-medium">Quản lý</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <User className="mr-2 text-blue-600" size={20} />
                      Thông tin cá nhân
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <User size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">Họ và tên</p>
                        <p className="font-medium">{manager.fullName}</p>
                      </div>
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Info size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">
                          Mã quản lý
                        </p>
                        <p className="font-medium">{manager.code}</p>
                      </div>
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Mail size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">Email</p>
                        <p className="font-medium">{manager.email}</p>
                      </div>
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Phone size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">
                          Số điện thoại
                        </p>
                        <p className="font-medium">{manager.phoneNumber}</p>
                      </div>
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Shield size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">
                          Trạng thái
                        </p>
                        <div className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              manager.status === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          <p className="font-medium">
                            {manager.status ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <Users className="mr-2 text-blue-600" size={20} />
                      Thông tin nhóm
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Users size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">Tên nhóm</p>
                        <p className="font-medium">
                          {manager.groupName ?? "Chưa phân nhóm"}
                        </p>
                      </div>
                      <div className="flex items-center py-2 border-b border-gray-100 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 group-hover:bg-blue-100 transition-colors duration-300">
                          <Info size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3">Mã nhóm</p>
                        <p className="font-medium break-all">
                          {manager.groupId ?? "Chưa có nhóm"}
                        </p>
                      </div>
                      <div className="flex items-start py-2 group hover:bg-blue-50/20 rounded-md px-2 transition-all duration-300">
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3 mt-0.5 group-hover:bg-blue-100 transition-colors duration-300">
                          <Users size={16} />
                        </div>
                        <p className="text-gray-500 text-sm w-1/3 mt-0.5">
                          Nhân viên
                        </p>
                        <div className="flex-1">
                          <div
                            className="flex items-center mb-1 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-300"
                            onClick={() => setStaffExpanded(!staffExpanded)}
                          >
                            <span className="font-medium text-sm mr-1">
                              Nhân viên ({manager.staffNames?.length ?? 0})
                            </span>
                            {staffExpanded ? (
                              <ChevronDown
                                size={16}
                                className="transition-transform duration-300"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                className="transition-transform duration-300"
                              />
                            )}
                          </div>

                          {staffExpanded && (
                            <div className="bg-gray-50 rounded-lg p-3 mt-2 max-h-60 overflow-y-auto shadow-inner">
                              <ul className="space-y-2">
                                {manager.staffNames?.map((staff, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-medium shadow-sm">
                                      {staff.charAt(0)}
                                    </div>
                                    <span className="font-medium">{staff}</span>
                                  </li>
                                )) || (
                                  <li className="text-sm text-gray-500 p-2">
                                    Không có nhân viên
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center">
                <Users className="mr-2 text-blue-600" size={20} />
                Thành viên nhóm {manager.groupName ?? "Chưa phân nhóm"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {manager.staffNames?.map((staff, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/20 group"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 text-lg font-medium shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        {staff.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{staff}</h4>
                        <p className="text-sm text-gray-500">Nhân viên</p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                      <Users size={32} />
                    </div>
                    <p className="text-gray-500 mb-2">
                      Chưa có nhân viên trong nhóm
                    </p>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300">
                      Thêm nhân viên
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-5 text-gray-800 flex items-center">
                <Activity className="mr-2 text-blue-600" size={20} />
                Lịch sử hoạt động
              </h3>
              <div className="space-y-4">
                <div className="flex group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 w-0.5 bg-blue-200 my-2"></div>
                  </div>
                  <div className="ml-4 flex-1 p-3 rounded-lg group-hover:bg-blue-50/20 transition-all duration-300">
                    <p className="text-sm text-gray-500">
                      {formattedDateTime(manager.updatedAt)}
                    </p>
                    <p className="font-medium text-lg mt-1">
                      Cập nhật thông tin cá nhân
                    </p>
                    <p className="text-gray-600 mt-2">
                      Thông tin cá nhân đã được cập nhật thành công
                    </p>
                  </div>
                </div>

                <div className="flex group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1 w-0.5 bg-green-200 my-2"></div>
                  </div>
                  <div className="ml-4 flex-1 p-3 rounded-lg group-hover:bg-green-50/20 transition-all duration-300">
                    <p className="text-sm text-gray-500">
                      {formattedDateTime(manager.createdAt)}
                    </p>
                    <p className="font-medium text-lg mt-1">Tạo tài khoản</p>
                    <p className="text-gray-600 mt-2">
                      Tài khoản quản lý đã được tạo thành công
                    </p>
                  </div>
                </div>

                <div className="flex group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Users size={18} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 p-3 rounded-lg group-hover:bg-blue-50/20 transition-all duration-300">
                    <p className="text-sm text-gray-500">
                      {formattedDateTime(manager.createdAt)}
                    </p>
                    <p className="font-medium text-lg mt-1">
                      Được thêm vào nhóm
                    </p>
                    <p className="text-gray-600 mt-2">
                      Đã được thêm vào nhóm{" "}
                      {manager.groupName ?? "Chưa phân nhóm"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {manager && (
        <UpdateManagerModal
          manager={manager}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateManager}
        />
      )}
    </div>
  );
}
