/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Tag, ShoppingBag, Clock, AlertCircle, Check } from "lucide-react";
import { TItemTypeResponse } from "@/schema/VinLaudry/item-type.schema";
import { getServiceTypeById } from "@/apis/laudry/service-type";

export const ItemTypeColumns: ColumnDef<TItemTypeResponse>[] = [
  {
    accessorKey: "itemCode",
    header: "Mã Mặt Hàng",
    cell: ({ row }) => (
      <div
        className="font-medium flex items-center gap-2 text-blue-600"
        title={row.getValue("itemCode")}
      >
        <Tag size={16} className="text-blue-500" />
        {row.getValue("itemCode")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên Mặt Hàng",
    cell: ({ row }) => {
      const name = row.getValue<string>("name");
      const imageUrl = row.original.imageUrl;
      
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gray-50 border flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <ShoppingBag size={16} className="text-gray-400" />
            )}
          </div>
          <div className="font-medium">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "serviceType",
    header: "Loại Dịch Vụ",
    cell: ({ row }) => {
      const [serviceTypeName, setServiceTypeName] = useState<string>(row.getValue("serviceType") || "");
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const serviceTypeId = row.original.serviceTypeId;

      useEffect(() => {
        const fetchServiceType = async () => {
          if (!serviceTypeName && serviceTypeId) {
            setIsLoading(true);
            try {
              const response = await getServiceTypeById(serviceTypeId);
              if (response && response.payload) {
                setServiceTypeName(response.payload.name || "Không xác định");
              }
            } catch (error) {
              console.error("Error fetching service type:", error);
            } finally {
              setIsLoading(false);
            }
          }
        };

        fetchServiceType();
      }, [serviceTypeId, serviceTypeName]);

      return (
        <div className="font-medium">
          {isLoading ? (
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs inline-flex items-center">
              {serviceTypeName}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "defaultPrice",
    header: "Giá Mặc Định",
    cell: ({ row }) => {
      const defaultPrice = row.getValue<number | null>("defaultPrice");
      const pricePerItem = row.original.pricePerItem;
      const pricePerKg = row.original.pricePerKg;
      
      return (
        <div className="font-medium">
          {defaultPrice !== null ? (
            <div className="text-emerald-700">
              {defaultPrice.toLocaleString('vi-VN')} đ
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              {pricePerItem ? `${pricePerItem.toLocaleString('vi-VN')} đ/món` : ''}
              {pricePerItem && pricePerKg ? ' | ' : ''}
              {pricePerKg ? `${pricePerKg.toLocaleString('vi-VN')} đ/kg` : ''}
              {!pricePerItem && !pricePerKg ? 'Chưa thiết lập' : ''}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô Tả",
    cell: ({ row }) => {
      const description = row.getValue<string | null>("description") || "Không có mô tả";
      return (
        <div 
          className="max-w-xs truncate cursor-pointer text-gray-600" 
          title={description}
          onClick={() => description !== "Không có mô tả" && alert(description)}
        >
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "estimatedProcessTime",
    header: "Thời Gian Xử Lý",
    cell: ({ row }) => {
      const processingTime = row.getValue<number | null>("estimatedProcessTime");
      const standardTime = row.original.standardProcessingTime;
      
      return (
        <div className="flex items-center gap-1">
          <Clock size={16} className="text-gray-500" />
          <span className="text-gray-700">
            {processingTime ? `${processingTime} phút` : 
              standardTime ? `${standardTime} phút` : 'Chưa thiết lập'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      
      return (
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium w-fit flex items-center gap-1
          ${status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
        `}>
          {status === 'Active' ? (
            <>
              <Check size={12} className="text-green-600" />
              <span>Hoạt động</span>
            </>
          ) : (
            <>
              <AlertCircle size={12} className="text-red-600" />
              <span>Không hoạt động</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];