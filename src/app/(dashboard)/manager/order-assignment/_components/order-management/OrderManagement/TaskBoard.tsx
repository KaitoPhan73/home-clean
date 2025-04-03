"use client";

import { useRef, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskBoard, OrderType, BoardStatus } from "@/hooks/useTaskBoard";
import { TaskCard } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderManagement/TaskCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

const columnGroups = [
  {
    id: "group1",
    title: "Đơn mới & Đã hủy",
    statuses: ["Draft", "Cancelled"],
  },
  {
    id: "group2",
    title: "Chờ xử lý",
    statuses: ["Pending"],
  },
  {
    id: "group3",
    title: "Đang thực hiện & Hoàn thành",
    statuses: ["Accepted", "Completed"],
  },
];

const statusConfig: Record<
  BoardStatus,
  { label: string; bgColor: string; textColor: string; headerBg: string }
> = {
  Draft: { label: "Đơn mới", bgColor: "bg-gray-50", textColor: "text-gray-600", headerBg: "bg-gray-100" },
  Pending: { label: "Chờ xử lý", bgColor: "bg-yellow-50", textColor: "text-yellow-600", headerBg: "bg-yellow-100" },
  Accepted: { label: "Đang thực hiện", bgColor: "bg-blue-50", textColor: "text-blue-600", headerBg: "bg-blue-100" },
  Completed: { label: "Hoàn thành", bgColor: "bg-green-50", textColor: "text-green-600", headerBg: "bg-green-100" },
  Cancelled: { label: "Đã hủy", bgColor: "bg-red-50", textColor: "text-red-600", headerBg: "bg-red-100" },
};

interface ColumnProps {
  status: BoardStatus;
  orders: OrderType[];
  moveOrder: (order: OrderType, newStatus: BoardStatus) => void;
  config: { label: string; bgColor: string; textColor: string; headerBg: string };
  onRefresh: () => void;
  groupId?: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

interface ColumnGroupProps {
  group: {
    id: string;
    title: string;
    statuses: string[];
  };
  boardData: Record<BoardStatus, OrderType[]>;
  moveOrder: (order: OrderType, newStatus: BoardStatus) => void;
  onRefresh: () => void;
  groupId?: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

interface TaskBoardProps {
  orders: OrderType[];
  groupId?: string;
}

const Column = ({ status, orders, moveOrder, config, onRefresh, groupId, isCollapsed, toggleCollapse }: ColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [{ isOver }, drop] = useDrop({
    accept: "ORDER",
    drop: (item: OrderType) => moveOrder(item, status),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });
  drop(ref);

  const displayOrders = orders.slice(0, visibleCount);
  const hasMore = orders.length > visibleCount;
  const isExpanded = visibleCount > 3;

  const handleShowMore = () => setVisibleCount((prev) => prev + 3);
  const handleCollapse = () => setVisibleCount(3);

  return (
    <div
      ref={ref}
      className={`${config.bgColor} border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isCollapsed ? "w-16" : "w-full"
      } h-full flex flex-col ${
        isOver && !isCollapsed ? "ring-2 ring-blue-300" : ""
      }`}
    >
      <div
        className={`${config.headerBg} ${config.textColor} p-2 font-medium text-sm flex ${
          isCollapsed ? "justify-center" : "justify-between"
        } items-center shadow-sm`}
      >
        {isCollapsed ? (
          <Button variant="ghost" size="sm" onClick={toggleCollapse}>
            <ChevronRight size={14} />
          </Button>
        ) : (
          <>
            <span className="text-ellipsis text-base max-w-[120px] overflow-hidden whitespace-nowrap">{config.label}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-white px-1 py-0.5 rounded-full shadow-inner">{orders.length}</span>
              <Button variant="ghost" size="sm" onClick={toggleCollapse}>
                <ChevronLeft size={14} />
              </Button>
            </div>
          </>
        )}
      </div>
      {!isCollapsed && (
        <>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {displayOrders.length === 0 ? (
              <div className="p-4 border border-dashed border-gray-300 rounded-lg text-gray-400 text-center text-sm min-h-[80px] flex items-center justify-center">
                Không có đơn hàng
              </div>
            ) : (
              displayOrders.map((order: OrderType) => (
                <TaskCard key={order.id} order={order} onRefresh={onRefresh} groupId={groupId} />
              ))
            )}
          </div>
          {(hasMore || isExpanded) && (
            <div className="p-4 pt-0 flex flex-col gap-2">
              {hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full flex items-center justify-center gap-2"
                  onClick={handleShowMore}
                >
                  <ChevronDown size={16} />
                  Xem thêm ({Math.min(3, orders.length - visibleCount)})
                </Button>
              )}
              {isExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full flex items-center justify-center gap-2"
                  onClick={handleCollapse}
                >
                  <ChevronUp size={16} />
                  Thu gọn
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ColumnGroup = ({ group, boardData, moveOrder, onRefresh, groupId, isCollapsed, toggleCollapse }: ColumnGroupProps) => {
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>(group.statuses);

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0 max-w-[33%]">
      <div className="bg-white p-1 rounded-md shadow-sm border border-gray-400">
        <h3 className="font-medium text-gray-700 text-sm flex justify-between items-center">
          <span className="ml-3">{group.title}</span>
          <Button variant="ghost" size="sm" onClick={toggleCollapse}>
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </h3>
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-col gap-4 flex-1">
          {group.statuses.map((status) => (
            <Column
              key={status}
              status={status as BoardStatus}
              orders={boardData[status as BoardStatus] || []}
              moveOrder={moveOrder}
              config={statusConfig[status as BoardStatus]}
              onRefresh={onRefresh}
              groupId={groupId}
              isCollapsed={false}
              toggleCollapse={() => {
                if (visibleStatuses.includes(status)) {
                  setVisibleStatuses(visibleStatuses.filter((s) => s !== status));
                } else {
                  setVisibleStatuses([...visibleStatuses, status]);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ orders, groupId }) => {
  const { boardData, moveOrder, refreshData } = useTaskBoard(orders);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    group1: false,
    group2: false,
    group3: false,
  });

  const toggleCollapseGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 p-0 bg-gray-50 rounded-lg h-[calc(100vh-0rem)] overflow-hidden">
        {columnGroups.map((group) => (
          <ColumnGroup
            key={group.id}
            group={group}
            boardData={boardData}
            moveOrder={moveOrder}
            onRefresh={refreshData}
            groupId={groupId}
            isCollapsed={collapsedGroups[group.id]}
            toggleCollapse={() => toggleCollapseGroup(group.id)}
          />
        ))}
      </div>
    </DndProvider>
  );
};