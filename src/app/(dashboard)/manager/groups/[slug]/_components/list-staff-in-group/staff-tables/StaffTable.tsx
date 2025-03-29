// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import StaffItem from "@/app/(dashboard)/manager/groups/[slug]/_components/list-staff-in-group/staff-tables/StaffItem";


// interface StaffDetails {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
//   status: string;
//   lastUpdated: string;
// }

// interface Props {
//   staffData: StaffDetails[];
//   isLoading: boolean;
//   isRefreshing: boolean;
//   onRefresh: () => void;
// }

// const StaffTable = ({ staffData, isLoading, isRefreshing, onRefresh }: Props) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const filteredStaff = staffData.filter((staff) => {
//     return (
//       (searchQuery === "" || staff.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       (statusFilter === "all" || staff.status.toLowerCase() === statusFilter.toLowerCase())
//     );
//   });

//   return (
//     <Card className="shadow-md h-full w-full md:w-[70%]">
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>Danh sách nhân viên</CardTitle>
//           <Badge variant="outline">{isLoading ? <Skeleton className="h-4 w-16" /> : `${staffData.length} Nhân viên`}</Badge>
//         </div>
//         <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing}>
//           <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//         </Button>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <Skeleton className="h-12 w-full" />
//         ) : (
//           filteredStaff.map((staff) => <StaffItem key={staff.id} staff={staff} />)
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default StaffTable;
