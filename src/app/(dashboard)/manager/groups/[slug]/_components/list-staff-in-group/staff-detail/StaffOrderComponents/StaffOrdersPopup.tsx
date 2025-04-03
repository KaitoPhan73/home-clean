// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { ClipboardListIcon } from "lucide-react";
// import { format, parseISO } from "date-fns";
// import { TOrderResponse } from "@/schema/order.schema";
// import { getOrderByStaffId } from "@/apis/staff";
// import OrderStats, { StatsData } from "./OrderStats";
// import OrderDateGroup, { OrdersByDate } from "./OrderGroup";
// import { NoOrders, OrderSkeletons } from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-detail/StaffOrderComponents/OrderSkeletons";

// interface ApiResponse {
//   payload: {
//     items: TOrderResponse[];
//     page: number;
//     size: number;
//     total: number;
//     totalPages: number;
//   };
//   status: number;
// }

// interface StaffOrdersPopupProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   staffId: string;
//   staffName?: string;
// }

// const StaffOrdersPopup: React.FC<StaffOrdersPopupProps> = ({
//   isOpen,
//   onOpenChange,
//   staffId,
//   staffName = "Nhân viên",
// }) => {
//   const [orders, setOrders] = useState<TOrderResponse[]>([]);
//   const [ordersByDate, setOrdersByDate] = useState<OrdersByDate[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState<StatsData>({
//     total: 0,
//     completed: 0,
//     inProgress: 0,
//     pending: 0,
//     cancelled: 0,
//     accepted: 0,
//   });

//   useEffect(() => {
//     if (isOpen && staffId) {
//       fetchOrders();
//     }
//   }, [isOpen, staffId]);

//   useEffect(() => {
//     // Group orders by date
//     const groupedOrders = orders.reduce<Record<string, TOrderResponse[]>>((acc, order) => {
//       const dateStr = format(new Date(order.createdAt), "yyyy-MM-dd");
//       if (!acc[dateStr]) {
//         acc[dateStr] = [];
//       }
//       acc[dateStr].push(order);
//       return acc;
//     }, {});

//     // Sort dates by most recent
//     const sortedDates = Object.keys(groupedOrders).sort((a, b) => 
//       parseISO(b).getTime() - parseISO(a).getTime()
//     );

//     const ordersByDateArray = sortedDates.map(date => ({
//       date,
//       orders: groupedOrders[date],
//       isOpen: true // Default to expanded
//     }));

//     setOrdersByDate(ordersByDateArray);

//     // Calculate statistics
//     calculateStats(orders);
//   }, [orders]);

//   const calculateStats = (orders: TOrderResponse[]) => {
//     const completed = orders.filter(
//       (order) =>
//         order.status?.toLowerCase() === "completed" ||
//         order.status?.toLowerCase() === "hoàn thành"
//     ).length;
//     const inProgress = orders.filter(
//       (order) =>
//         order.status?.toLowerCase() === "in_progress" ||
//         order.status?.toLowerCase() === "đang xử lý"
//     ).length;
//     const pending = orders.filter(
//       (order) =>
//         order.status?.toLowerCase() === "pending" ||
//         order.status?.toLowerCase() === "chờ xử lý"
//     ).length;
//     const cancelled = orders.filter(
//       (order) =>
//         order.status?.toLowerCase() === "cancelled" ||
//         order.status?.toLowerCase() === "đã hủy"
//     ).length;
//     const accepted = orders.filter(
//       (order) => order.status?.toLowerCase() === "accepted"
//     ).length;

//     setStats({
//       total: orders.length,
//       completed,
//       inProgress,
//       pending,
//       cancelled,
//       accepted,
//     });
//   };

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = (await getOrderByStaffId(staffId)) as unknown as ApiResponse;
//       console.log("API Response:", response);

//       let fetchedOrders: TOrderResponse[] = [];

//       if (
//         response &&
//         response.payload &&
//         Array.isArray(response.payload.items)
//       ) {
//         fetchedOrders = response.payload.items;
//         console.log("Fetched Orders from payload.items:", fetchedOrders);
//       } else {
//         console.warn("API returned unexpected format or empty data:", response);
//         fetchedOrders = [];
//       }

//       setOrders(fetchedOrders);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDateGroup = (dateStr: string) => {
//     setOrdersByDate(prev => 
//       prev.map(group => 
//         group.date === dateStr 
//           ? { ...group, isOpen: !group.isOpen } 
//           : group
//       )
//     );
//   };

//   const renderContent = () => {
//     if (loading) {
//       return <OrderSkeletons />;
//     }
    
//     if (orders.length === 0) {
//       return <NoOrders />;
//     }
    
//     return (
//       <div className="space-y-4">
//         {ordersByDate.map((group) => (
//           <OrderDateGroup 
//             key={group.date} 
//             dateGroup={group} 
//             toggleDateGroup={toggleDateGroup} 
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold flex items-center gap-2">
//             <ClipboardListIcon className="h-5 w-5" />
//             Đơn hàng của {staffName}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
//           <OrderStats stats={stats} />
//           <Separator />
//           <ScrollArea className="flex-1 pr-4">
//             {renderContent()}
//           </ScrollArea>
//         </div>

//         <DialogFooter className="pt-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Đóng
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default StaffOrdersPopup;