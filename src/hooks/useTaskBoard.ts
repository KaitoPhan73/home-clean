// hooks/useTaskBoard.ts
import { useState } from "react";

export type BoardStatus = "Draft" | "Pending" | "Accepted" | "Completed" | "Cancelled";

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

  const moveOrder = (order: OrderType, newStatus: BoardStatus) => {
    setBoardData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((status) => {
        newData[status as BoardStatus] = newData[status as BoardStatus].filter(
          (o) => o.id !== order.id
        );
      });
      newData[newStatus] = [...newData[newStatus], { ...order, status: newStatus }];
      return newData;
    });
  };

  const refreshData = () => {
    console.log("Refreshing data after order update");
  };

  return { boardData, moveOrder, refreshData };
};