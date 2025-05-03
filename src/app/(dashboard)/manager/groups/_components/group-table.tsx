/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DataTable } from "@/components/table/data-table";
// import { columns } from "./group-tables/columns";
import { getGroupById } from "@/apis/group";
import { cookies } from "next/headers";
import GroupDetailsView from "@/app/(dashboard)/manager/groups/_components/group-management/GroupDetailsView";
import { Suspense } from "react";

const GroupTable = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  let groupData: any[] = [];
  let totalItems = 0;

  if (userCookie) {
    try {
      const userData = JSON.parse(userCookie.value);
      const groupId = userData.groupId;

      if (groupId) {
        const groupResponse = await getGroupById(groupId);

        if (groupResponse?.payload) {
          groupData = [groupResponse.payload];
          totalItems = 1;
        }
      }
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  }

  // Add userId to the group data for use in columns
  const finalData = groupData.map((item) => {
    return {
      ...item,
      userId: userCookie ? JSON.parse(userCookie.value).userId : null,
    };
  });

  return (
    <div className="container mx-auto px-4 py-2">
      <Suspense fallback={<LoadingState />}>
        <GroupDetailsView data={finalData} />
      </Suspense>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-gray-200 shadow-sm">
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-blue-600 font-medium">Đang tải thông tin...</p>
      <p className="text-blue-400 text-sm mt-1">Vui lòng đợi trong giây lát</p>
    </div>
  </div>
);

export default GroupTable;
