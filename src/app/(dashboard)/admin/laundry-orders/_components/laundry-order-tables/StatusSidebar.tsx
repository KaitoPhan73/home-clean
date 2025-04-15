/* eslint-disable jsx-a11y/role-supports-aria-props */
import React from "react";
import { cn } from "@/lib/utils";

export type StatusConfig = {
  [key: string]: {
    id: string;
    label: string;
    color: string;
    borderColor: string;
    icon: React.ReactNode | null;
  };
};

type StatusSidebarProps = {
  activeTab: string;
  statusCounts: Record<string, number>;
  onTabChange: (tabId: string) => void;
  statusConfig: StatusConfig;
};

export const StatusSidebar = ({
  activeTab,
  statusCounts,
  onTabChange,
  statusConfig,
}: StatusSidebarProps) => {
  const allStatuses = ["all", "Draft", "Paid", "Completed", "Processing", "PendingPayment", "Canceled"];

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
      {allStatuses.map((status) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        const count = statusCounts[status] || 0;
        const isActive = activeTab === status;

        return (
          <button
            key={status}
            onClick={() => onTabChange(status)}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
              "hover:bg-gray-100 border-l-4",
              isActive ? `${config.borderColor} bg-gray-100` : "border-l-transparent"
            )}
            aria-selected={isActive}
          >
            <div className="flex items-center gap-2">
              {config.icon && <span className={config.color}>{config.icon}</span>}
              <span className="font-medium text-gray-800">{config.label}</span>
            </div>
            <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};