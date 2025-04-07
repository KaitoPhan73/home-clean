"use client";

import { ArrowLeft, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundMessage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/manager/laundry">
          <Button variant="ghost" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
      <Card className="shadow-sm border-gray-200 py-8">
        <CardContent className="flex flex-col items-center justify-center">
          <X className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 mb-6">Đơn hàng bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/manager/laundry">
            <Button>Quay lại danh sách đơn hàng</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}