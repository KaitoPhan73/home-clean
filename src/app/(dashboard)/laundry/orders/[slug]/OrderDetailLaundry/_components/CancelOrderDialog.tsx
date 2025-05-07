/* CancelOrderDialog.tsx */
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderCode: string;
  isLoading: boolean;
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  orderCode,
  isLoading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Xác nhận hủy đơn hàng</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn đang hủy đơn hàng{" "}
            <span className="font-medium text-slate-900">{orderCode}</span>
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <p className="font-medium mb-2">Lưu ý khi hủy đơn hàng:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tất cả các công việc liên quan sẽ bị hủy</li>
              <li>Đơn hàng đã thanh toán không thể hủy</li>
              <li>Thao tác này không thể hoàn tác</li>
              <li>Mọi tiến trình xử lý sẽ dừng lại</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận hủy đơn hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderDialog;