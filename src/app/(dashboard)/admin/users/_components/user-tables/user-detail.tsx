"use client";

import React, { useEffect, useState } from "react";
import { TUserResponse } from "@/schema/user.schema";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  XCircle,
  IdCard,
} from "lucide-react";
import { getHouseById } from "@/apis/house";
import { THouseResponse } from "@/schema/house.schema";
import { TBuildingResponse } from "@/schema/building.schema";
import { getBuildingById } from "@/apis/building";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailPopupProps {
  user: TUserResponse;
  onClose: () => void;
}

export const UserDetailPopup: React.FC<UserDetailPopupProps> = ({
  user,
  onClose,
}) => {
  const [house, setHouse] = useState<THouseResponse | null>(null);
  const [building, setBuilding] = useState<TBuildingResponse | null>(null);
  useEffect(() => {
    const fetchHouseInfo = async (houseId: string) => {
      try {
        const res = await getHouseById(houseId);
        const resBuilding = await getBuildingById(res.payload.buildingId);
        setBuilding(resBuilding.payload);
        setHouse(res.payload);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhà:", error);
        setHouse(null);
      }
    };

    if (user.houseId) {
      fetchHouseInfo(user.houseId);
    } else {
      setHouse(null);
    }
  }, [user.houseId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Chi Tiết Người Dùng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <DetailSection
            title="Thông Tin Cá Nhân"
            items={[
              {
                icon: <User className="text-blue-500" />,
                label: "Họ và Tên",
                value: user.fullName,
              },
              {
                icon: <Phone className="text-green-500" />,
                label: "Tên Đăng Nhập",
                value: user.username,
              },
              {
                icon: <Phone className="text-purple-500" />,
                label: "Số Điện Thoại",
                value: user.phoneNumber,
              },
              {
                icon: <IdCard className="text-purple-500" />,
                label: "Mã Cư Dân",
                value: user.citizenCode,
              },
              {
                icon: <Mail className="text-red-500" />,
                label: "Email",
                value: user.email,
              },
            ]}
          />

          <DetailSection
            title="Thông Tin Hệ Thống"
            items={[
              // {
              //   icon: <ShieldCheck className="text-yellow-500" />,
              //   label: "Vai Trò",
              //   value: user.role,
              // },
              {
                icon: <MapPin className="text-orange-500" />,
                label: "Nhà",
                value: house ? (
                  `${house.numberOfRoom} - ${building?.name}`
                ) : (
                  <Skeleton className="w-full h-[20px] rounded-full" />
                ),
              },
              {
                icon:
                  user.status === "Active" ? (
                    <Check className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  ),
                label: "Trạng Thái",
                value:
                  user.status === "Active" ? "Đã xác nhận" : "Chưa xác nhận",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({
  title,
  items,
}: {
  title: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
  }>;
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">
      {title}
    </h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="text-gray-700 font-medium">{item.label}</span>
          </div>
          <div className="text-gray-900 font-semibold text-right min-w-[120px]">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);
