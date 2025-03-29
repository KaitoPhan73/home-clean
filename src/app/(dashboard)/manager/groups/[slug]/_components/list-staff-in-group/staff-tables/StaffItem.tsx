// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// interface StaffDetails {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   avatar?: string;
//   status: string;
//   lastUpdated: string;
// }

// const StaffItem = ({ staff }: { staff: StaffDetails }) => {
//   return (
//     <div className="flex items-center justify-between py-2 border-b">
//       <div className="flex items-center gap-4">
//         <Avatar>
//           <AvatarImage src={staff.avatar} />
//           <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//         </Avatar>
//         <div>
//           <p className="font-medium">{staff.name}</p>
//           <p className="text-sm text-muted-foreground">{staff.email}</p>
//         </div>
//       </div>
//       <Badge>{staff.status}</Badge>
//     </div>
//   );
// };

// export default StaffItem;
