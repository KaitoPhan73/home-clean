import { getAllGroups } from "@/apis/group";
import { getSummary, getSummaryByPeriod } from "@/apis/revenue";
import RevenuePage from "./components/RevenuePage";

const formatDateToString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default async function Page() {
  try {
    // Set initial date range to the current date
    const today = new Date();
    const fromDateStr = formatDateToString(today);
    const toDateStr = formatDateToString(today);   
    const groupBy = "day";                         
    const groupId = undefined;                    

    // Only load essential data initially
    const [summaryResponse, periodResponse, groupsResponse] = await Promise.all([
      getSummary(fromDateStr, toDateStr, groupId),
      getSummaryByPeriod(fromDateStr, toDateStr, groupBy, groupId),
      getAllGroups(),
    ]);

    return (
      <div>
        <RevenuePage
          initialSummaryData={summaryResponse.payload || null}
          initialServiceSummaryData={null} // Will be fetched on demand
          initialPeriodData={Array.isArray(periodResponse.payload) ? periodResponse.payload : []}
          initialGroups={groupsResponse.payload.items || []}
          initialDateFrom={fromDateStr}
          initialDateTo={toDateStr}
          initialGroupBy={groupBy}
          initialSelectedGroupId="all_groups"
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