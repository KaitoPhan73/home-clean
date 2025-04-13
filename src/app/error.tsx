"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
  className?: string;
}

interface ErrorMessage {
  code: string | number;
  message: string;
  status?: number;
}

export default function ErrorBoundary({
  error,
  reset,
  className = "",
}: ErrorBoundaryProps) {
  let errorMessage: ErrorMessage;

  try {
    errorMessage = JSON.parse(error.message);
  } catch {
    errorMessage = {
      code: "UNKNOWN_ERROR",
      message: "Đã xảy ra lỗi không xác định",
      status: 500,
    };
  }

  return (
    <Card
      className={`p-6 h-screen flex flex-col items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <AlertOctagon className="h-6 w-6 text-red-600" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Đã có lỗi xảy ra</h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-red-500 border-red-200">
                Mã lỗi: {errorMessage.code}
              </Badge>
              {errorMessage.status && (
                <Badge
                  variant="outline"
                  className="text-red-500 border-red-200"
                >
                  Status: {errorMessage.status}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500">{errorMessage.message}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.error("Error details:", {
              code: errorMessage.code,
              status: errorMessage.status,
              message: errorMessage.message,
              originalError: error,
            });
            reset();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </Card>
  );
}
