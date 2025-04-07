import { Suspense } from "react";
import LaundryDetailPage from "@/app/(dashboard)/laundry/orders/[slug]/OrderDetailLaundry/LaundryDetailPage";
import LoadingSkeleton from "@/app/(dashboard)/laundry/orders/Loading";

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LaundryDetailPage />
    </Suspense>
  );
}
