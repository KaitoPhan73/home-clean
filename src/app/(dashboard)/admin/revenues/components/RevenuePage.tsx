/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// RevenuePage.tsx - Optimized with lazy loading and debounced filtering
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";

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
  const [activeTab, setActiveTab] = useState<"daily" | "services" | "groupAndStaff" | "additionalServices">("daily");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(initialSummaryData);
  const [serviceSummaryData, setServiceSummaryData] = useState<ServiceSummaryData | null>(initialServiceSummaryData);
  const [groupComparisonData, setGroupComparisonData] = useState<GroupComparisonData | null>(null);
  const [summaryByStaffData, setSummaryByStaffData] = useState<SummaryByStaffData | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    summary: false,
    service: false,
    period: false,
    group: false,
    staff: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<TGroupResponse[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialSelectedGroupId);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month" | "year">(initialGroupBy);
  const [periodData, setPeriodData] = useState<any[]>(initialPeriodData);
  const [dateFrom, setDateFrom] = useState<Date>(new Date(initialDateFrom));
  const [dateTo, setDateTo] = useState<Date>(new Date(initialDateTo));
  const [filterParams, setFilterParams] = useState({
    dateFrom,
    dateTo,
    selectedGroupId,
    groupBy,
  });

  // Debounce filter parameters to avoid excessive API calls
  const debouncedFilterParams = useDebounce(filterParams, 500);

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

  // Handle filter change
  const handleFilterSubmit = useCallback(() => {
    setFilterParams({
      dateFrom,
      dateTo,
      selectedGroupId,
      groupBy,
    });
  }, [dateFrom, dateTo, selectedGroupId, groupBy]);

  // Fetch data based on active tab and debounced filters
  useEffect(() => {
    const { dateFrom, dateTo, selectedGroupId, groupBy } = debouncedFilterParams;
    const fromDateStr = dateFrom.toISOString().split("T")[0];
    const toDateStr = dateTo.toISOString().split("T")[0];
    const groupIdParam = selectedGroupId !== "all_groups" ? selectedGroupId : undefined;

    // Always fetch summary and period data for the main tab
    const fetchEssentialData = async () => {
      try {
        setIsLoading(prev => ({ ...prev, summary: true, period: true }));
        
        const [summaryResponse, periodResponse] = await Promise.all([
          getSummary(fromDateStr, toDateStr, groupIdParam),
          getSummaryByPeriod(fromDateStr, toDateStr, groupBy, groupIdParam),
        ]);

        setSummaryData(summaryResponse.payload);
        if (periodResponse && Array.isArray(periodResponse.payload)) {
          setPeriodData(periodResponse.payload);
        } else {
          setPeriodData([]);
        }
        
        setError(null);
      } catch (error) {
        console.error("Error fetching essential data:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(prev => ({ ...prev, summary: false, period: false }));
      }
    };

    fetchEssentialData();

    // Fetch data for the active tab only
    if (activeTab === "services" && !serviceSummaryData) {
      const fetchServiceData = async () => {
        try {
          setIsLoading(prev => ({ ...prev, service: true }));
          const serviceSummaryResponse = await getServiceSummary(fromDateStr, toDateStr, groupIdParam);
          setServiceSummaryData(serviceSummaryResponse.payload);
        } catch (error) {
          console.error("Error fetching service data:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, service: false }));
        }
      };
      fetchServiceData();
    } else if (activeTab === "groupAndStaff" && (!groupComparisonData || !summaryByStaffData)) {
      const fetchGroupAndStaffData = async () => {
        try {
          setIsLoading(prev => ({ ...prev, group: true, staff: true }));
          const [groupComparisonResponse, summaryByStaffResponse] = await Promise.all([
            getGroupComparison(fromDateStr, toDateStr),
            getSummaryByStaff(fromDateStr, toDateStr, groupIdParam),
          ]);
          setGroupComparisonData(groupComparisonResponse.payload as GroupComparisonData);
          setSummaryByStaffData(summaryByStaffResponse.payload as SummaryByStaffData);
        } catch (error) {
          console.error("Error fetching group and staff data:", error);
        } finally {
          setIsLoading(prev => ({ ...prev, group: false, staff: false }));
        }
      };
      fetchGroupAndStaffData();
    }
  }, [debouncedFilterParams, activeTab, serviceSummaryData, groupComparisonData, summaryByStaffData]);

  // Tab change handler with lazy loading
  const handleTabChange = (value: string) => {
    const newTab = value as "daily" | "services" | "groupAndStaff" | "additionalServices";
    setActiveTab(newTab);
    
    // Reset selected service when switching tabs
    if (newTab !== "services") {
      setSelectedServiceId("all");
    }
  };

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
          onFilterSubmit={handleFilterSubmit}
        />
        <SummaryCards summaryData={summaryData} isLoading={isLoading.summary} />
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                onChange={(e) => {
                  setGroupBy(e.target.value as "day" | "week" | "month" | "year");
                  handleFilterSubmit();
                }}
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
            {isLoading.service ? (
              <div className="flex justify-center items-center h-64">Đang tải dữ liệu dịch vụ...</div>
            ) : (
              <ServiceCharts
                serviceSummaryData={serviceSummaryData}
                selectedServiceId={selectedServiceId}
                setSelectedServiceId={setSelectedServiceId}
              />
            )}
          </TabsContent>
          <TabsContent value="groupAndStaff">
            {isLoading.group || isLoading.staff ? (
              <div className="flex justify-center items-center h-64">Đang tải dữ liệu nhóm và nhân viên...</div>
            ) : (
              <GroupAndStaffCharts
                groupComparisonData={groupComparisonData}
                summaryByStaffData={summaryByStaffData}
              />
            )}
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