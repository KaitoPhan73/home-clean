/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/table/data-table";
import { ItemTypeColumns } from "./item-type-tables/columns";
import { getAllItemTypes } from "@/apis/laudry/item-type";
import { TItemTypeResponse } from "@/schema/VinLaudry/item-type.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, Weight } from "lucide-react";

const ItemTypeTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [itemTypes, setItemTypes] = useState<TItemTypeResponse[]>([]);
  const [perItemTypes, setPerItemTypes] = useState<TItemTypeResponse[]>([]);
  const [perKgTypes, setPerKgTypes] = useState<TItemTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const fetchItemTypes = async () => {
      setIsLoading(true);
      try {
        const page = searchParams.get("page") || "1";
        const search = searchParams.get("search") || "";
        const size = searchParams.get("size") || "10";

        const filters = {
          page,
          size,
          ...(search && { search }),
        };

        const response = await getAllItemTypes(filters);
        const data = response.payload.items;
        setItemTypes(data);
        setTotalPages(response.payload.totalPages);
        
        // Filter by service type
        setPerItemTypes(data.filter(item => item.serviceType === "PerItem"));
        setPerKgTypes(data.filter(item => item.serviceType === "PerKg"));
      } catch (error) {
        console.error("Error fetching item types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemTypes();
  }, [searchParams]);

  const getActiveData = () => {
    switch(activeTab) {
      case "perItem":
        return perItemTypes;
      case "perKg":
        return perKgTypes;
      default:
        return itemTypes;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="all" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            Tất cả
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {itemTypes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="perItem" className="flex items-center gap-2">
            <Package2 size={16} />
            Theo món
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {perItemTypes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="perKg" className="flex items-center gap-2">
            <Weight size={16} />
            Theo kg
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {perKgTypes.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <DataTable
            data={itemTypes}
            columns={ItemTypeColumns}
            totalItems={totalPages}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="perItem" className="mt-0">
          <DataTable
            data={perItemTypes}
            columns={ItemTypeColumns}
            totalItems={totalPages}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="perKg" className="mt-0">
          <DataTable
            data={perKgTypes}
            columns={ItemTypeColumns}
            totalItems={totalPages}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItemTypeTable;