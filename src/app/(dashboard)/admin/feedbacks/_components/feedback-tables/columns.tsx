/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Star } from "lucide-react";
import { TFeedbackResponse } from "@/schema/feedback.schema";
import { getStaffById } from "@/apis/staff"; // Make sure this path is correct

export const columns: ColumnDef<TFeedbackResponse>[] = [
  {
    accessorKey: "serviceOrderId",
    header: "Mã Đơn Hàng",
    cell: ({ row }) => (
      <div
        className="w-36 truncate cursor-pointer font-medium"
        title={row.getValue("serviceOrderId")}
        onClick={() => alert(row.getValue("serviceOrderId"))}
      >
        {(row.getValue("serviceOrderId") as string).substring(0, 8)}...
        
      </div>
    ),
  },
  {
    accessorKey: "staffId",
    header: "Nhân Viên",
    cell: ({ row }) => {
      const [staffName, setStaffName] = useState<string>("");
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const staffId = row.getValue<string>("staffId");

      useEffect(() => {
        const fetchStaffName = async () => {
          try {
            const response = await getStaffById(staffId);
            if (response && response.payload) {
              setStaffName(response.payload.fullName || "Không xác định");
            } else {
              setStaffName("Không xác định");
            }
          } catch (error) {
            console.error("Error fetching staff data:", error);
            setStaffName("Lỗi tải dữ liệu");
          } finally {
            setIsLoading(false);
          }
        };

        if (staffId) {
          fetchStaffName();
        }
      }, [staffId]);

      return (
        <div className="font-medium">
          {isLoading ? (
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="flex flex-col">
              <span>{staffName}</span>
              {/* <span className="text-xs text-gray-500" title={staffId}>
                {staffId.substring(0, 8)}...
              </span> */}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Đánh Giá",
    cell: ({ row }) => {
      const rating = row.getValue<number>("rating");
      return (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
            />
          ))}
          {/* <span className="ml-2 font-medium">{rating}/5</span> */}
        </div>
      );
    },
  },
  {
    accessorKey: "comments",
    header: "Nhận Xét",
    cell: ({ row }) => {
      const comments = row.getValue<string>("comments") || "Không có nhận xét";
      return (
        <div 
          className="max-w-xs truncate cursor-pointer" 
          title={comments}
          onClick={() => comments !== "Không có nhận xét" && alert(comments)}
        >
          {comments}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày Tạo",
    cell: ({ row }) => (
      <div className="text-gray-600">
        {new Date(row.getValue("createdAt")).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];