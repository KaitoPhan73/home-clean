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
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GroupTable;
