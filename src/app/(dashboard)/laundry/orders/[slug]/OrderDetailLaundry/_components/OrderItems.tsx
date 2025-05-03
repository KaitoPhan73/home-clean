import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingBag, Scale, Tag, AlertCircle, Package, Star } from "lucide-react";

interface ItemTypeResponse {
  id: string;
  itemCode: string;
  name: string;
  description: string | null;
  defaultPrice: number;
  pricePerItem: number | null;
  pricePerKg: number | null;
  imageUrl: string | null;
}

interface OrderDetailByItem {
  id: string;
  itemTypeId: string;
  quantity: number;
  weight: number;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  actualWeight: number | null;
  estimatedTime: string | null;
  actualCompletionTime: string | null;
  itemTypeResponse: ItemTypeResponse;
}

interface OrderDetailByKg {
  id: string;
  itemTypeId: string;
  quantity?: number;
  weight: number;
  unitPrice: number | null;
  subtotal: number | null;
  notes: string | null;
  actualWeight: number | null;
  estimatedTime: string | null;
  actualCompletionTime: string | null;
  itemTypeResponse?: ItemTypeResponse;
}

interface ItemType {
  name: string;
  itemCode: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number | null;
  subtotal: number;
  itemType: ItemType;
  weight?: number;
  pricePerKg?: number;
  pricePerItem?: number;
  serviceType?: string;
  defaultPrice?: number;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceCode?: string;
}

interface OrderItemsProps {
  items?: OrderItem[];
  additionalServices?: AdditionalService[];
  orderCode?: string;
  status?: string;
  orderDetailsByItem?: OrderDetailByItem[];
  orderDetailsByKg?: OrderDetailByKg[];
  orderAdditionalServicesResponse?: AdditionalService[];
  totalAmount?: number;
}

const mapOrderDetailByItemToOrderItem = (
  detail: OrderDetailByItem
): OrderItem => ({
  id: detail.id,
  name: detail.itemTypeResponse.name,
  quantity: detail.quantity,
  unitPrice: detail.unitPrice,
  subtotal: detail.subtotal,
  weight: detail.actualWeight || detail.weight,
  pricePerItem: detail.itemTypeResponse.pricePerItem || detail.unitPrice,
  defaultPrice: detail.itemTypeResponse.defaultPrice,
  itemType: {
    name: detail.itemTypeResponse.name,
    itemCode: detail.itemTypeResponse.itemCode,
  },
});

const mapOrderDetailByKgToOrderItem = (detail: OrderDetailByKg): OrderItem => ({
  id: detail.id,
  name: detail.itemTypeResponse?.name || "Unknown Item",
  quantity: detail.quantity || 1,
  unitPrice: detail.unitPrice,
  subtotal: detail.subtotal || 0,
  weight: detail.actualWeight || detail.weight,
  pricePerKg: detail.itemTypeResponse?.pricePerKg || detail.unitPrice || 0,
  defaultPrice: detail.itemTypeResponse?.defaultPrice || 0,
  itemType: {
    name: detail.itemTypeResponse?.name || "Unknown Item",
    itemCode: detail.itemTypeResponse?.itemCode || "Không tính theo kg",
  },
});

const formatNumber = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Component để hiển thị icon
const PointIcon = () => (
  <Star className="h-4 w-4 inline-block text-yellow-500 ml-1" />
);

export function OrderItems({
  items,
  additionalServices,
  orderCode,
  status,
  orderDetailsByItem = [],
  orderDetailsByKg = [],
  orderAdditionalServicesResponse,
}: OrderItemsProps) {
  const processedItems: OrderItem[] = [];

  // Ưu tiên dữ liệu từ orderDetailsByKg và orderDetailsByItem
  if (orderDetailsByItem && orderDetailsByItem.length > 0) {
    processedItems.push(
      ...orderDetailsByItem.map(mapOrderDetailByItemToOrderItem)
    );
  }

  if (orderDetailsByKg && orderDetailsByKg.length > 0) {
    processedItems.push(...orderDetailsByKg.map(mapOrderDetailByKgToOrderItem));
  }

  // Chỉ thêm items nếu không có dữ liệu từ orderDetailsByKg và orderDetailsByItem
  if (processedItems.length === 0 && items && items.length > 0) {
    processedItems.push(...items);
  }

  // Loại bỏ trùng lặp dựa trên id
  const uniqueItems = Array.from(
    new Map(processedItems.map((item) => [item.id, item])).values()
  );

  const kgBasedItems = uniqueItems.filter(item => !!item.weight && item.weight > 0);
  const itemBasedItems = uniqueItems.filter(item => !item.weight || item.weight === 0);

  const displayServices =
    additionalServices || orderAdditionalServicesResponse || [];

  const mapStatusToVietnamese = (status: string): string => {
    const statusMap: Record<string, string> = {
      PendingPayment: "Đang Chờ Thanh Toán",
      Processing: "Đang Xử Lý",
      Completed: "Hoàn Thành",
      Cancelled: "Đã Hủy",
      Delivered: "Đã Giao Hàng",
      Paid: "Đã Thanh Toán",
      Draft: "Đơn Mới",
    };
    return statusMap[status] || status;
  };

  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    const statusColors: Record<string, string> = {
      ĐangChờThanhToán: "bg-yellow-100 text-yellow-800",
      ĐangXửLý: "bg-blue-100 text-blue-800",
      HoànThành: "bg-green-100 text-green-800",
      ĐãHủy: "bg-red-100 text-red-800",
      ĐãGiaoHàng: "bg-purple-100 text-purple-800",
      ĐãThanhToán: "bg-green-100 text-green-800",
      ĐơnMới: "bg-gray-100 text-gray-800",
    };

    const vietnameseStatus = mapStatusToVietnamese(status);
    const color = statusColors[vietnameseStatus] || "bg-gray-100 text-gray-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {vietnameseStatus}
      </span>
    );
  };

  const isEmpty = uniqueItems.length === 0;

  return (
    <Card className="shadow-sm border-gray-200 mb-6">
      <CardHeader className="mb-2 bg-gradient-to-r from-blue-100 to-red-50 border-b border-gray-100 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Chi tiết đơn hàng</CardTitle>
            {orderCode && (
              <p className="text-sm text-gray-500 mt-1">Mã đơn: {orderCode}</p>
            )}
          </div>
          {status && <div>{renderStatusBadge(status)}</div>}
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-96">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Đơn hàng đang được xử lý
            </h3>
            <p className="text-gray-500 max-w-md">
              Hiện tại đơn hàng này đang được đặt giặt theo kg. Hãy đợi nhân
              viên phân loại và update quần áo để list ra thông tin nhé!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {kgBasedItems.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3 bg-green-50 p-2 rounded-lg">
                  <Scale className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-md font-medium text-green-700">Đồ giặt tính theo kg</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-2">Mặt hàng</th>
                        <th className="pb-2 text-center">Khối lượng</th>
                        <th className="pb-2 text-center">Đơn giá/kg</th>
                        <th className="pb-2 text-center">Giá mặc định</th>
                        <th className="pb-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kgBasedItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                                <Scale className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  Mã: {item.itemType.itemCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {item.weight?.toFixed(2)} kg
                          </td>
                          <td className="py-3 text-center">
                            {formatNumber(item.pricePerKg || 0)} <PointIcon />
                          </td>
                          <td className="py-3 text-center">
                            {formatNumber(item.defaultPrice || 0)} <PointIcon />
                          </td>
                          <td className="py-3 text-right font-medium">
                            {formatNumber(item.subtotal)} <PointIcon />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {itemBasedItems.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3 bg-blue-50 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-md font-medium text-blue-700">Đồ giặt tính theo món</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-2">Mặt hàng</th>
                        <th className="pb-2 text-center">Số lượng</th>
                        <th className="pb-2 text-center">Đơn giá/món</th>
                        <th className="pb-2 text-center">Giá mặc định</th>
                        <th className="pb-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemBasedItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                <Tag className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  Mã: {item.itemType.itemCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-center">
                            {formatNumber(item.pricePerItem || item.unitPrice || 0)} <PointIcon />
                          </td>
                          <td className="py-3 text-center">
                            {formatNumber(item.defaultPrice || 0)} <PointIcon />
                          </td>
                          <td className="py-3 text-right font-medium">
                            {formatNumber(item.subtotal)} <PointIcon />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {displayServices.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3 bg-purple-50 p-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-md font-medium text-purple-700">Dịch vụ bổ sung</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-2">Dịch vụ</th>
                        <th className="pb-2 text-center">Mã</th>
                        <th className="pb-2 text-right">Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayServices.map((service) => (
                        <tr key={service.id} className="border-b border-gray-100">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-xs text-gray-500">
                                  {service.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {service.serviceCode || "-"}
                          </td>
                          <td className="py-3 text-right font-medium">
                            {formatNumber(service.price)} <PointIcon />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}