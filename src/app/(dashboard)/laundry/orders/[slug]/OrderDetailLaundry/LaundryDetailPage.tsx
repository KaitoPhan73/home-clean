/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { httpVinLaundry } from "@/lib/http";
import LoadingSkeleton from "@/app/(dashboard)/laundry/orders/Loading";
import NotFoundMessage from "@/app/(dashboard)/laundry/orders/NotFound";
import OrderHeader from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderHeader";
import OrderInfo from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderInfo";
import OrderItems from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderItems";
import OrderSummary from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderSummary";
import OrderTasks from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/_components/OrderTasks";
import { getAllUsers } from "@/apis/vinwallet/user";

// Importable UI components - chỉ dùng tham khảo
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOrderLaundryResponse } from "@/schema/VinLaudry/laundry-order";

interface OrderDetail {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  itemType: {
    name: string;
    itemCode: string;
  };
}

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
}

export default function LaundryDetailPage() {
  const params = useParams();
  const orderId = params.slug;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<TOrderLaundryResponse | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Get current user from cookies
    const userCookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("user="));
    
    if (userCookie) {
      try {
        const userJson = decodeURIComponent(userCookie.split("=")[1]);
        setCurrentUser(JSON.parse(userJson));
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderResponse = await httpVinLaundry.get<TOrderLaundryResponse>(`/orders/${orderId}`);
        setOrder(orderResponse.payload);

        if (orderResponse?.payload?.userId) {
          try {
            const userResponse = await getAllUsers({ id: orderResponse.payload.userId });
            setUser(userResponse.payload.items.find((u) => u.id === orderResponse.payload.userId) || null);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const calculateTotals = () => {
    if (!order) return { itemsTotal: 0, additionalServicesTotal: 0, discount: 0, grandTotal: 0 };

    const itemsByKgTotal = order.orderDetailsByKg.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);

    const itemsByItemTotal = order.orderDetailsByItem.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    const servicesTotal = order.orderAdditionalServicesResponse.reduce((total, service) => {
      return total + service.price;
    }, 0);

    const discount = order.discountAmount || 0;
    const total = itemsByKgTotal + itemsByItemTotal + servicesTotal - discount;

    return {
      itemsTotal: itemsByKgTotal + itemsByItemTotal,
      additionalServicesTotal: servicesTotal,
      discount,
      grandTotal: total,
    };
  };

  const consolidateItems = () => {
    if (!order) return [];

    const itemMap = new Map();

    order.orderDetailsByItem.forEach(item => {
      const itemKey = item.itemTypeResponse.id;
      if (itemMap.has(itemKey)) {
        const existingItem = itemMap.get(itemKey);
        existingItem.quantity += item.quantity;
        existingItem.subtotal += item.quantity * item.unitPrice;
      } else {
        itemMap.set(itemKey, {
          id: item.id,
          name: item.itemTypeResponse.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          itemType: {
            name: item.itemTypeResponse.name,
            itemCode: item.itemTypeResponse.itemCode,
          },
        });
      }
    });

    order.orderDetailsByKg.forEach(item => {
      const itemKey = item.itemTypeId;
      if (itemMap.has(itemKey)) {
        const existingItem = itemMap.get(itemKey);
        existingItem.quantity += 1;
        existingItem.subtotal += (item.subtotal || 0);
      } else {
        itemMap.set(itemKey, {
          id: item.id,
          name: item.itemTypeResponse?.name || "Không xác định",
          quantity: 1,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal || 0,
          itemType: {
            name: item.itemTypeResponse?.name || "Không xác định",
            itemCode: item.itemTypeResponse?.itemCode || "",
          },
        });
      }
    });

    return Array.from(itemMap.values());
  };

  const totals = calculateTotals();
  const consolidatedItems = consolidateItems();

  if (loading) return <LoadingSkeleton />;
  if (!order) return <NotFoundMessage />;

  return (
    <div className="container mx-auto py-1 px-1 bg-gradient-to-b from-purple-50 via-white to-white min-h-screen">
      <OrderHeader order={order} />
      
      <div className="mb-6 overflow-hidden rounded-lg">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full h-12 bg-white border border-gray-200 p-1 rounded-t-lg">
            <TabsTrigger 
              value="overview" 
              className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md"
            >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md"
            >
              Chi tiết đơn hàng
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="flex-1 h-full data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-md"
            >
              Tiến trình xử lý
            </TabsTrigger>
          </TabsList>
          
          <div className="p-4 bg-white border-x border-b border-gray-200 rounded-b-lg">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <OrderInfo order={order} user={user} />
                </div>
                <div className="lg:col-span-1">
                  <OrderSummary totals={totals} order={order} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <OrderItems items={consolidatedItems} additionalServices={order.orderAdditionalServicesResponse} />
                </div>
                <div className="lg:col-span-1">
                  <OrderSummary totals={totals} order={order} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              <OrderTasks orderId={order.id} currentUser={currentUser} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
