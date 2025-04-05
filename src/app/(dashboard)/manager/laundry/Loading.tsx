"use client";

import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}