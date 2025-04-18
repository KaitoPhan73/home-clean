import React from "react";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "./statusConfig";

interface StatusSidebarProps {
  activeTab: string;
  statusCounts: Record<string, number>;
  onTabChange: (tabId: string) => void;
}

const StatusSidebar = ({ activeTab, statusCounts, onTabChange }: StatusSidebarProps) => {
  return (
    <div className="w-64 shrink-0 border-r border-gray-200">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Trạng thái đơn hàng</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {Object.entries(statusConfig).map(([key, status]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200
                ${isActive 
                  ? `${status.activeBgColor} ${status.activeBorderColor}` 
                  : "hover:bg-gray-50 border-l-4 border-transparent"}`}
            >
              <div className="flex items-center gap-2">
                {status.icon}
                <span className={isActive 
                  ? `${status.activeTextColor}` 
                  : `${status.color}`}>
                  {status.label}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={isActive 
                  ? `${status.activeTextColor} border-none bg-opacity-0` 
                  : "bg-gray-50 text-gray-600"}
              >
                {statusCounts[key] || 0}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSidebar;
