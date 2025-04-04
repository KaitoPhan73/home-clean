// RevenuePage.tsx - Cập nhật với tab Dịch vụ bổ sung & Tùy chọn
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ScatterController,
} from "chart.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateFilter } from "./DateFilter";
import { SummaryCards } from "./SummaryCards";
import { DailyChart } from "./DailyChart";
import { PeriodChart } from "./PeriodChart";
import { GroupAndStaffCharts } from "./GroupAndStaffCharts";
import { getAllGroups } from "@/apis/group";
import {
  getSummary,
  getServiceSummary,
  getSummaryByPeriod,
  getGroupComparison,
  getSummaryByStaff,
} from "@/apis/revenue";
import { TGroupResponse } from "@/schema/group.schema";
import { GroupComparisonData, SummaryByStaffData } from "@/apis/revenue";
import { ServiceSummaryData, SummaryData } from "@/app/(dashboard)/admin/revenues/chart-config/types";
import { ServiceCharts } from "@/app/(dashboard)/admin/revenues/components/SummaryByService";
import { AdditionalServicesTab } from "@/app/(dashboard)/admin/revenues/components/OptionsAndExtraServiceChart";

// Đăng ký Chart.js và plugin datalabels
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ScatterController,
);

interface RevenuePageProps {
  initialSummaryData: SummaryData | null;
  initialServiceSummaryData: ServiceSummaryData | null;
  initialPeriodData: any[];
  initialGroups: TGroupResponse[];
  initialDateFrom: string;
  initialDateTo: string;
  initialGroupBy: "day" | "week" | "month" | "year";
  initialSelectedGroupId: string;
}

export default function RevenuePage({
  initialSummaryData,
  initialServiceSummaryData,
  initialPeriodData,
  initialGroups,
  initialDateFrom,
  initialDateTo,
  initialGroupBy,
  initialSelectedGroupId,
}: RevenuePageProps) {
  // Thêm tab dịch vụ bổ sung vào giá trị của activeTab
  const [activeTab, setActiveTab] = useState<"daily" | "services" | "groupAndStaff" | "additionalServices">("daily");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(initialSummaryData);
  const [serviceSummaryData, setServiceSummaryData] = useState<ServiceSummaryData | null>(initialServiceSummaryData);
  const [groupComparisonData, setGroupComparisonData] = useState<GroupComparisonData | null>(null);
  const [summaryByStaffData, setSummaryByStaffData] = useState<SummaryByStaffData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TGroupResponse[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialSelectedGroupId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month" | "year">(initialGroupBy);
  const [periodData, setPeriodData] = useState<any[]>(initialPeriodData);
  const [dateFrom, setDateFrom] = useState<Date>(new Date(initialDateFrom));
  const [dateTo, setDateTo] = useState<Date>(new Date(initialDateTo));

  useEffect(() => {
    if (!groups.length) {
      const fetchGroups = async () => {
        try {
          const response = await getAllGroups();
          setGroups(response.payload.items || []);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };
      fetchGroups();
    }
  }, [groups]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const fromDateStr = dateFrom.toISOString().split("T")[0];
      const toDateStr = dateTo.toISOString().split("T")[0];
      const groupIdParam = selectedGroupId !== "all_groups" ? selectedGroupId : undefined;

      const [summaryResponse, serviceSummaryResponse, periodResponse, groupComparisonResponse, summaryByStaffResponse] =
        await Promise.all([
          getSummary(fromDateStr, toDateStr, groupIdParam),
          getServiceSummary(fromDateStr, toDateStr, groupIdParam),
          getSummaryByPeriod(fromDateStr, toDateStr, groupBy, groupIdParam),
          getGroupComparison(fromDateStr, toDateStr),
          getSummaryByStaff(fromDateStr, toDateStr, groupIdParam),
        ]);

      setSummaryData(summaryResponse.payload);
      setServiceSummaryData(serviceSummaryResponse.payload);
      setGroupComparisonData(groupComparisonResponse.payload as GroupComparisonData);
      setSummaryByStaffData(summaryByStaffResponse.payload as SummaryByStaffData);

      if (periodResponse && Array.isArray(periodResponse.payload)) {
        setPeriodData(periodResponse.payload);
      } else {
        console.error("Invalid period data:", periodResponse);
        setPeriodData([]);
      }

      setError(null);
      setSelectedServiceId("all");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      setPeriodData([]);
      setGroupComparisonData(null);
      setSummaryByStaffData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateFrom, dateTo, selectedGroupId, groupBy]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto max-h-screen">
      <div className="max-w-7xl mx-auto">
        <DateFilter
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          groups={groups}
        />
        <SummaryCards summaryData={summaryData} />
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="daily" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Theo ngày
            </TabsTrigger>
            <TabsTrigger value="services" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Theo dịch vụ
            </TabsTrigger>
            <TabsTrigger value="groupAndStaff" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Theo nhóm và nhân viên
            </TabsTrigger>
            <TabsTrigger value="additionalServices" className="py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Dịch vụ bổ sung & Tùy chọn
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">Nhóm theo:</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as "day" | "week" | "month" | "year")}
                className="border rounded-md p-2"
              >
                <option value="day">Ngày</option>
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
              </select>
            </div>
            <DailyChart summaryData={summaryData} periodData={periodData} groupBy={groupBy} />
            <PeriodChart periodData={periodData} groupBy={groupBy} />
          </TabsContent>
          <TabsContent value="services">
            <ServiceCharts
              serviceSummaryData={serviceSummaryData}
              selectedServiceId={selectedServiceId}
              setSelectedServiceId={setSelectedServiceId}
            />
          </TabsContent>
          <TabsContent value="groupAndStaff">
            <GroupAndStaffCharts
              groupComparisonData={groupComparisonData}
              summaryByStaffData={summaryByStaffData}
            />
          </TabsContent>
          <TabsContent value="additionalServices">
            <AdditionalServicesTab
              dateFrom={dateFrom}
              dateTo={dateTo}
              selectedGroupId={selectedGroupId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}