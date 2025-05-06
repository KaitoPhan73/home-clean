// import { TManagerResponse } from "@/schema/manager.schema";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { User, Phone, Mail } from "lucide-react";

// interface ManagerTabProps {
//   managerInfo: TManagerResponse | null;
// }

// const ManagerTab = ({ managerInfo }: ManagerTabProps) => {
//   return (
//     <Card className="border-none shadow-sm">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <User className="h-5 w-5 text-indigo-500" />
//           Thông Tin Quản Lý
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {managerInfo ? (
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <User className="h-4 w-4 text-gray-500" />
//               <span className="text-gray-700">
//                 Họ và tên: {managerInfo.fullName}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Phone className="h-4 w-4 text-gray-500" />
//               <span className="text-gray-700">
//                 Số điện thoại: {managerInfo.phoneNumber || "Không có"}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Mail className="h-4 w-4 text-gray-500" />
//               <span className="text-gray-700">
//                 Email: {managerInfo.email || "Không có"}
//               </span>
//             </div>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center">
//             Không có thông tin quản lý
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ManagerTab;