import { Suspense } from "react";
import LaundryDetailPage from "@/app/(dashboard)/manager/laundry/[slug]/OrderDetailLaundry/LaundryDetailPage";
import LoadingSkeleton from "@/app/(dashboard)/manager/laundry/Loading";

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LaundryDetailPage />
    </Suspense>
  );
}
