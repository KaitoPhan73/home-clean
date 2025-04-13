"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
  className?: string;
}

export function ErrorBoundary({
  error,
  reset,
  className = "",
}: ErrorBoundaryProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <AlertOctagon className="h-6 w-6 text-red-600" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Đã có lỗi xảy ra</h3>
          <p className="text-sm text-gray-500">
            {error.message || "Không thể tải dữ liệu. Vui lòng thử lại."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </Card>
  );
}
