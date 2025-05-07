/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { updateManager } from "@/apis/manager";
import {
  TManagerResponse,
  TUpdateManagerRequest,
  ManagerUpdateSchema,
} from "@/schema/manager.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  X,
  Save,
  Loader2,
  User,
  Phone,
  Mail,
  Key,
  Lock,
  AlertCircle,
  FileCode,
  ChevronDown,
  ToggleLeftIcon,
  ToggleLeft,
} from "lucide-react";
import { handleErrorApi } from "@/lib/utils";

interface UpdateManagerModalProps {
  manager: TManagerResponse;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedManager: TManagerResponse) => void;
}

export default function UpdateManagerModal({
  manager,
  isOpen,
  onClose,
  onUpdate,
}: UpdateManagerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateManagerRequest>({
    resolver: zodResolver(ManagerUpdateSchema),
    defaultValues: {
      fullName: manager.fullName,
      phoneNumber: manager.phoneNumber,
      email: manager.email,
      code: manager.code,
      status: manager.status,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: manager.fullName,
        phoneNumber: manager.phoneNumber,
        email: manager.email,
        code: manager.code,
        status: manager.status,
      });
      setError(null);
      setActiveTab("personal");
    }
  }, [isOpen, manager, reset]);

  const onSubmit = async (data: TUpdateManagerRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await updateManager(manager.id, data);
      onUpdate(response.payload);
      onClose();
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
          <h2 className="text-xl font-semibold flex items-center">
            <User size={24} className="mr-2" />
            Chỉnh sửa thông tin quản lý
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <User size={16} className="mr-2" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center px-6 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === "account"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <Key size={16} className="mr-2" />
            Thông tin tài khoản
          </button>
        </div>

        {/* Form content with scrolling */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-5">
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-blue-700 text-sm flex items-center">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  <span>
                    Vui lòng điền đầy đủ thông tin cá nhân của quản lý
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User size={16} className="mr-2 text-blue-600" />
                      Họ và tên <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("fullName")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nhập họ và tên"
                      />
                      <User
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone size={16} className="mr-2 text-blue-600" />
                      Số điện thoại <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("phoneNumber")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nhập số điện thoại"
                      />
                      <Phone
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail size={16} className="mr-2 text-blue-600" />
                    Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="Nhập email"
                    />
                    <Mail
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Account Information Tab */}
            {activeTab === "account" && (
              <div className="space-y-5">
                <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-yellow-700 text-sm flex items-center">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  <span>
                    Mật khẩu chỉ được cập nhật khi bạn nhập giá trị mới
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FileCode size={16} className="mr-2 text-blue-600" />
                      Mã quản lý <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("code")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        placeholder="Nhập mã quản lý"
                      />
                      <FileCode
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                    </div>
                    {errors.code && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.code.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <ToggleLeftIcon
                        size={16}
                        className="mr-2 text-blue-600"
                      />
                      Trạng thái
                    </label>
                    <div className="relative">
                      <select
                        {...register("status")}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="Active">Kích hoạt</option>
                        <option value="Inactive">Không kích hoạt</option>
                      </select>
                      <ToggleLeft
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <ChevronDown
                        className="absolute right-3 top-3 text-gray-400"
                        size={16}
                      />
                    </div>
                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Lock size={16} className="mr-2 text-blue-600" />
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type="password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)"
                    />
                    <Lock
                      size={16}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Action buttons - fixed at bottom */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 outline-none transition-all duration-200 flex items-center"
            >
              <X size={18} className="mr-2" />
              Hủy
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
