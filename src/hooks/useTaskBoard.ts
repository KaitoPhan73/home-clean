/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export type BoardStatus = "Draft" | "Pending" | "Accepted" | "InProgress" | "Completed" | "Cancelled";

export interface OrderType {
  status: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
  code: string;
  id: string;
  note: string | null;
  price: number | null;
  address: string;
  bookingDate: string | null;
  employeeId: string | null;
  employeeRating: number | null;
  customerFeedback: string | null;
  cleaningToolsRequired: boolean | null;
  cleaningToolsProvided: boolean | null;
  serviceType: string;
  distanceToCustomer: number;
  priorityLevel: string;
  notes: string | null;
  discountCode: string | null;
  discountAmount: number | null;
  totalAmount: number;
  realTimeStatus: string;
  jobStartTime: string | null;
  jobEndTime: string | null;
  emergencyRequest: boolean;
  cleaningAreas: string[];
  itemsToClean: string[];
  estimatedArrivalTime: string | null;
  estimatedDuration: number | null;
  actualDuration: number | null;
  cancellationDeadline: string | null;
  timeSlotId: string;
  serviceId: string;
  userId: string;
  extraServices: string[];
}

export const useTaskBoard = (initialOrders: OrderType[]) => {
  const [boardData, setBoardData] = useState<Record<BoardStatus, OrderType[]>>(() => {
    const initialBoard: Record<BoardStatus, OrderType[]> = {
      Draft: [],
      Pending: [],
      Accepted: [],
      InProgress: [],
      Completed: [],
      Cancelled: [],
    };
    initialOrders.forEach((order) => {
      const status = order.status as BoardStatus;
      if (initialBoard[status]) initialBoard[status].push(order);
      else initialBoard.Draft.push(order);
    });
    return initialBoard;
  });

  // Lắng nghe sự kiện từ SignalR
  useEffect(() => {
    // Xử lý thay đổi trạng thái đơn hàng
    const handleOrderStatusChanged = (event: CustomEvent) => {
      const { orderId, status } = event.detail;
      console.log(`Đơn hàng ${orderId} thay đổi trạng thái thành ${status}`);

      setBoardData((prev) => {
        const newData = { ...prev };

        // Tìm đơn hàng trong tất cả các trạng thái
        let targetOrder: OrderType | undefined;
        Object.keys(newData).forEach((currentStatus) => {
          const orderIndex = newData[currentStatus as BoardStatus].findIndex(
            (o) => o.id === orderId
          );
          if (orderIndex >= 0) {
            // Xóa đơn hàng khỏi trạng thái hiện tại
            targetOrder = {
              ...newData[currentStatus as BoardStatus][orderIndex],
              status: status as BoardStatus,
            };
            newData[currentStatus as BoardStatus] = newData[
              currentStatus as BoardStatus
            ].filter((o) => o.id !== orderId);
          }
        });

        // Thêm đơn hàng vào trạng thái mới
        if (targetOrder && newData[status as BoardStatus]) {
          newData[status as BoardStatus] = [
            ...newData[status as BoardStatus],
            targetOrder,
          ];
        } else if (!targetOrder) {
          console.warn(`Không tìm thấy đơn hàng ${orderId} trong boardData`);
        }

        return newData;
      });
    };

    // Xử lý đơn hàng mới
    const handleOrderCreated = (event: CustomEvent) => {
      const { order } = event.detail;
      console.log(`Nhận đơn hàng mới: ${order.id}`);

      // Đảm bảo trạng thái hợp lệ
      const status = (order.status || "Draft") as BoardStatus;

      setBoardData((prev) => {
        const newData = { ...prev };
        // Thêm đơn hàng mới vào trạng thái tương ứng
        if (newData[status]) {
          newData[status] = [...newData[status], { ...order, status }];
        } else {
          newData.Draft = [...newData.Draft, { ...order, status: "Draft" }];
        }
        return newData;
      });
    };

    window.addEventListener("orderStatusChanged", handleOrderStatusChanged as EventListener);
    window.addEventListener("orderCreated", handleOrderCreated as EventListener);

    return () => {
      window.removeEventListener("orderStatusChanged", handleOrderStatusChanged as EventListener);
      window.removeEventListener("orderCreated", handleOrderCreated as EventListener);
    };
  }, []);

  // Hàm di chuyển đơn hàng thủ công
  const moveOrder = (order: OrderType, newStatus: BoardStatus) => {
    setBoardData((prev) => {
      const newData = { ...prev };
      // Xóa đơn hàng khỏi trạng thái hiện tại
      Object.keys(newData).forEach((status) => {
        newData[status as BoardStatus] = newData[status as BoardStatus].filter(
          (o) => o.id !== order.id
        );
      });
      // Thêm đơn hàng vào trạng thái mới
      newData[newStatus] = [...newData[newStatus], { ...order, status: newStatus }];
      return newData;
    });
  };

  // Hàm làm mới dữ liệu (nếu cần gọi API)
  const refreshData = () => {
    console.log("Đang làm mới dữ liệu sau khi cập nhật đơn hàng");
    // Nếu cần gọi API để lấy dữ liệu mới, thêm logic ở đây
    // Ví dụ: fetchOrders().then((newOrders) => setBoardData(...));
  };

  return { boardData, moveOrder, refreshData };
};