// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
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
//   readyStaff: StaffDetails[];
//   isLoading: boolean;
// }

// const ReadyStaffList = ({ readyStaff, isLoading }: Props) => {
//   return (
//     <Card className="shadow-md h-full w-full md:w-[30%]">
//       <CardHeader>
//         <CardTitle>Nhân viên sẵn sàng</CardTitle>
//         <Badge variant="secondary">{readyStaff.length} Sẵn sàng</Badge>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <p>Đang tải...</p>
//         ) : (
//           readyStaff.map((staff) => <StaffItem key={staff.id} staff={staff} />)
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ReadyStaffList;
