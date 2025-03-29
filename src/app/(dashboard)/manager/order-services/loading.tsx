// import { Suspense } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
// import StaffTableInGroup from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/ListStaffInGroup";

// export default function StaffPage({ params }: { params: { slug: string } }) {
//   return (
//     <div className="container mx-auto">
//       <Suspense fallback={<StaffLoadingSkeleton />}>
//         <StaffTableInGroup />
//       </Suspense>
//     </div>
//   );
// }

// function StaffLoadingSkeleton() {
//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <Skeleton className="h-10 w-64" />
//         <Skeleton className="h-6 w-20" />
//       </div>
      
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="w-full md:w-[70%]">
//           <Skeleton className="h-[500px] w-full rounded-md" />
//         </div>
        
//         <div className="w-full md:w-[30%]">
//           <Skeleton className="h-[300px] w-full rounded-md" />
//         </div>
//       </div>
//     </div>
//   );
// }