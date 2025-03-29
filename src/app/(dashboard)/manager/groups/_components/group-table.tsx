/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DataTable } from "@/components/table/data-table";
// import { columns } from "./group-tables/columns";
import { getGroupById } from "@/apis/group";
import { cookies } from "next/headers";
import GroupDetailsView from "@/app/(dashboard)/manager/groups/_components/group-tables/group-detail-card";

const GroupTable = async () => {
  // Get the user cookie which contains the groupId
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  
  let groupData: any[] = [];
  let totalItems = 0;
  
  if (userCookie) {
    try {
      // Parse the user data from cookie
      const userData = JSON.parse(userCookie.value);
      const groupId = userData.groupId;
      
      if (groupId) {
        // Fetch the specific group by ID
        const groupResponse = await getGroupById(groupId);
        
        if (groupResponse?.payload) {
          // Format data for the table
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
    <div>
    <h2 className="text-xl font-bold mb-4">Thông tin nhóm</h2>
    <GroupDetailsView 
      data={finalData}

    />
  </div>
  );
};

export default GroupTable;