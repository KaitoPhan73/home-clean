import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const TransactionStatusChartSkeleton = () => {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-32 mt-1" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </Card>
  );
};

export default TransactionStatusChartSkeleton;
