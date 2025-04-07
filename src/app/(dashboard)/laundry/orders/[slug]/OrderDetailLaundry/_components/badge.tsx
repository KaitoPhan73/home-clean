import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ xử lý</Badge>;
    case "Processing":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Đang xử lý</Badge>;
    case "Completed":
      return <Badge className="bg-green-500 hover:bg-green-600">Hoàn thành</Badge>;
    case "Delivered":
      return <Badge className="bg-purple-500 hover:bg-purple-600">Đã giao</Badge>;
    case "Cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Đã hủy</Badge>;
    case "Draft":
      return <Badge className="bg-gray-500 hover:bg-gray-600">Bản nháp</Badge>;
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
  }
};