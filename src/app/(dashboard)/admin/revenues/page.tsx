import { getAllGroups } from "@/apis/group";
import { getSummary, getServiceSummary, getSummaryByPeriod } from "@/apis/revenue";
import RevenuePage from "./components/RevenuePage";

// Hàm định dạng ngày thành chuỗi YYYY-MM-DD
const formatDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Server Component
export default async function Page() {
  try {
    // Lấy ngày hiện tại
    const today = new Date();
    const fromDateStr = formatDateToString(today); // Ngày hiện tại
    const toDateStr = formatDateToString(today);   // Ngày hiện tại
    const groupBy = "day";                         // Giá trị mặc định
    const groupId = undefined;                     // Giá trị mặc định

    // Gọi các API
    const [summaryResponse, serviceSummaryResponse, periodResponse, groupsResponse] = await Promise.all([
      getSummary(fromDateStr, toDateStr, groupId),
      getServiceSummary(fromDateStr, toDateStr, groupId),
      getSummaryByPeriod(fromDateStr, toDateStr, groupBy, groupId),
      getAllGroups(),
    ]);

    return (
      <div>
        <RevenuePage
          initialSummaryData={summaryResponse.payload || null}
          initialServiceSummaryData={serviceSummaryResponse.payload || null}
          initialPeriodData={Array.isArray(periodResponse.payload) ? periodResponse.payload : []}
          initialGroups={groupsResponse.payload.items || []}
          initialDateFrom={fromDateStr}
          initialDateTo={toDateStr}
          initialGroupBy={groupBy}
          initialSelectedGroupId={groupId || "all_groups"}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data in Page:", error);
    return (
      <div>
        <RevenuePage
          initialSummaryData={null}
          initialServiceSummaryData={null}
          initialPeriodData={[]}
          initialGroups={[]}
          initialDateFrom={formatDateToString(new Date())}
          initialDateTo={formatDateToString(new Date())}
          initialGroupBy="day"
          initialSelectedGroupId="all_groups"
        />
      </div>
    );
  }
}