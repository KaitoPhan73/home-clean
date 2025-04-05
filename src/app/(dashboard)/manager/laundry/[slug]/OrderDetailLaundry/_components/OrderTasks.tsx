/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle, Clock, Calendar, AlertCircle, FileText,
  LucideIcon, ChevronRight, ClipboardList, ShoppingBag,
  Package, Scale
} from "lucide-react";
import { httpVinLaundry } from "@/lib/http";
import { format } from "date-fns";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Base interfaces
interface Task {
  id: string;
  taskCode: string;
  orderId: string;
  employeeId: string | null;
  taskName: string;
  description: string | null;
  priority: string;
  startDate: string | null;
  dueDate: string | null;
  completedDate: string | null;
  assignedBy: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  stepOrder?: number;
}

interface OrderTasksProps {
  orderId: string;
  currentUser: any;
}

// Define stage components
interface StageConfig {
  icon: LucideIcon;
  color: string;
  lightColor: string;
  title: string;
  description: string;
}

// Helper functions - move to separate utility file if needed
const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "Chưa cập nhật";
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch (error) {
    return "Ngày không hợp lệ";
  }
};

const getPriorityLabel = (priority: string) => {
  const priorityNum = parseInt(priority, 10);
  switch (priorityNum) {
    case 1: return "Cao";
    case 2: return "Trung bình";
    case 3: return "Thấp";
    default: return "Không xác định";
  }
};

const getPriorityColor = (priority: string) => {
  const priorityNum = parseInt(priority, 10);
  switch (priorityNum) {
    case 1: return "text-red-600 bg-red-50";
    case 2: return "text-orange-600 bg-orange-50";
    case 3: return "text-blue-600 bg-blue-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

// Extracted Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Completed": 
      return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    case "In Progress": 
      return <Badge className="bg-blue-100 text-blue-800">Đang thực hiện</Badge>;
    case "Pending": 
      return <Badge className="bg-gray-100 text-gray-800">Chờ xử lý</Badge>;
    default: 
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

// Sub-components
const LoadingState = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8 text-gray-500">
    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    Không có công việc nào được tìm thấy
  </div>
);

const ProgressBar = ({ completedCount, totalCount }: { completedCount: number, totalCount: number }) => (
  <div className="relative h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-r-full transition-all duration-500 ease-in-out"
      style={{ 
        width: `${Math.min(100, (completedCount / totalCount) * 100)}%` 
      }}
    />
  </div>
);

// Redesigned Vertical Stage Item Component
const VerticalStageItem = ({ 
  task, 
  index, 
  isCurrentStep, 
  isLastStep,
  stageConfigs,
  onEdit 
}: { 
  task: Task, 
  index: number, 
  isCurrentStep: boolean, 
  isLastStep: boolean,
  stageConfigs: Record<string, StageConfig>,
  onEdit: (task: Task) => void 
}) => {
  const isCompleted = task.status === "Completed";
  
  const getStageInfo = (task: Task): StageConfig => {
    const taskKey = task.taskName.toLowerCase().replace(/\s+/g, '_');
    const matchedStage = Object.keys(stageConfigs).find(key => 
      taskKey.includes(key) || key.includes(taskKey)
    );
    
    return matchedStage ? stageConfigs[matchedStage] : {
      icon: FileText,
      color: "text-gray-600",
      lightColor: "bg-gray-50",
      title: task.taskName,
      description: task.description || "Không có mô tả"
    };
  };
  
  const stageInfo = getStageInfo(task);
  const StageIcon = stageInfo.icon;
  
  return (
    <div className="relative flex items-start mb-6">
      {/* Stage icon with connector line */}
      <div className="relative mr-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
          isCompleted 
            ? "bg-green-100 border-2 border-green-400" 
            : isCurrentStep
            ? `${stageInfo.lightColor} border-2 border-purple-400`
            : "bg-gray-100 border-2 border-gray-200"
        }`}>
          {isCompleted ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <StageIcon className={`h-6 w-6 ${
              isCurrentStep ? stageInfo.color : "text-gray-400"
            }`} />
          )}
        </div>
        
        {/* Vertical connector line */}
        {!isLastStep && (
          <div className={`absolute left-1/2 top-12 w-0.5 h-8 -translate-x-1/2 ${
            isCompleted ? "bg-green-200" : "bg-gray-200"
          }`}></div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <div className="mb-2">
          <h4 className={`font-medium text-base ${
            isCompleted ? "text-green-700" : isCurrentStep ? "text-purple-700" : "text-gray-600"
          }`}>
            {stageInfo.title}
          </h4>
          <p className="text-sm text-gray-500">{task.description || stageInfo.description}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={task.status} />
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>{formatDateTime(task.dueDate)}</span>
            </div>
          )}
        </div>
        
        {/* Task details */}
        <div className="mb-3 text-sm text-gray-600">
          {isCompleted && task.completedDate && (
            <div className="flex items-center mb-1">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              <span>Hoàn thành: {formatDateTime(task.completedDate)}</span>
            </div>
          )}
          
          {task.notes && (
            <div className="mb-1 italic">
              {task.notes}
            </div>
          )}
        </div>
        
        {/* Action button */}
        <Button 
          variant={isCompleted ? "outline" : "default"}
          size="sm" 
          onClick={() => onEdit(task)}
          className={`
            ${isCompleted ? "text-green-600 border-green-200 hover:bg-green-50" : ""}
            ${isCurrentStep ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
          `}
        >
          {isCompleted ? (
            <><CheckCircle className="h-4 w-4 mr-1" /> Xem chi tiết</>
          ) : (
            <>Xử lý<ChevronRight className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

// Vertical Timeline component
const VerticalTimeline = ({ 
  tasks, 
  currentStep, 
  stageConfigs,
  onEditTask 
}: { 
  tasks: Task[], 
  currentStep: number, 
  stageConfigs: Record<string, StageConfig>,
  onEditTask: (task: Task) => void 
}) => {
  return (
    <div className="py-2 max-h-96 overflow-y-auto pr-2">
      {tasks.map((task, index) => (
        <VerticalStageItem 
          key={task.id} 
          task={task} 
          index={index} 
          isCurrentStep={task.stepOrder === currentStep}
          isLastStep={index === tasks.length - 1}
          stageConfigs={stageConfigs}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};

// Task Edit Dialog Component
const TaskEditDialog = ({ 
  isOpen, 
  onClose, 
  currentTask, 
  formData, 
  onChange, 
  onSelectChange, 
  onSubmit 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  currentTask: Task | null, 
  formData: any, 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, 
  onSelectChange: (name: string, value: string) => void, 
  onSubmit: () => void 
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-xl text-center text-purple-700">
          {currentTask?.status === "Completed" ? "Xem chi tiết công việc" : "Cập nhật trạng thái công việc"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="taskName">Tên công việc</Label>
          <Input
            id="taskName"
            name="taskName"
            value={formData.taskName}
            onChange={onChange}
            disabled={currentTask?.status === "Completed"}
            className="border-purple-200 focus:border-purple-300"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Mô tả công việc</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            disabled={currentTask?.status === "Completed"}
            rows={3}
            className="border-purple-200 focus:border-purple-300"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="priority">Độ ưu tiên</Label>
            <Select 
              value={formData.priority}
              onValueChange={(value) => onSelectChange("priority", value)}
              disabled={currentTask?.status === "Completed"}
            >
              <SelectTrigger className="border-purple-200 focus:border-purple-300">
                <SelectValue placeholder="Chọn độ ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Cao</SelectItem>
                <SelectItem value="2">Trung bình</SelectItem>
                <SelectItem value="3">Thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => onSelectChange("status", value)}
              disabled={currentTask?.status === "Completed"}
            >
              <SelectTrigger className="border-purple-200 focus:border-purple-300">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Chờ xử lý</SelectItem>
                <SelectItem value="In Progress">Đang thực hiện</SelectItem>
                <SelectItem value="Completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Ngày bắt đầu</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate ? formData.startDate.slice(0, 16) : ""}
              onChange={onChange}
              disabled={currentTask?.status === "Completed"}
              className="border-purple-200 focus:border-purple-300"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Hạn hoàn thành</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate ? formData.dueDate.slice(0, 16) : ""}
              onChange={onChange}
              disabled={currentTask?.status === "Completed"}
              className="border-purple-200 focus:border-purple-300"
            />
          </div>
        </div>
        
        {(formData.status === "Completed" || currentTask?.status === "Completed") && (
          <div className="grid gap-2">
            <Label htmlFor="completedDate">Ngày hoàn thành</Label>
            <Input
              id="completedDate"
              name="completedDate"
              type="datetime-local"
              value={formData.completedDate ? formData.completedDate.slice(0, 16) : ""}
              onChange={onChange}
              disabled={true}
              className="border-green-200 bg-green-50"
            />
          </div>
        )}
        
        <div className="grid gap-2">
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            disabled={currentTask?.status === "Completed"}
            rows={3}
            className="border-purple-200 focus:border-purple-300"
            placeholder="Nhập ghi chú cho công việc này..."
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Đóng
        </Button>
        
        {currentTask?.status !== "Completed" && (
          <Button 
            onClick={onSubmit}
            className={`${
              formData.status === "Completed" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {formData.status === "Completed" 
              ? "Hoàn thành công việc" 
              : "Cập nhật công việc"}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// New component to handle pre-defined stages config - simplified to 3 steps
const useStageConfigs = () => {
  return {
    "pickup_washing": {
      icon: ShoppingBag,
      color: "text-blue-600",
      lightColor: "bg-blue-50",
      title: "Lấy đồ và giặt đồ",
      description: "Nhận quần áo và tiến hành giặt"
    },
    "additional_services": {
      icon: Package,
      color: "text-purple-600",
      lightColor: "bg-purple-50",
      title: "Làm các dịch vụ thêm",
      description: "Thực hiện các dịch vụ bổ sung như ủi, là, tẩy vết bẩn"
    },
    "weighing_delivery": {
      icon: Scale,
      color: "text-green-600",
      lightColor: "bg-green-50",
      title: "Cân đồ và trả đồ",
      description: "Cân đo, kiểm tra và giao hàng"
    }
  };
};

// Helper function to transform existing tasks into the new 3-step structure
const mapTasksToThreeSteps = (existingTasks: Task[], stageConfig: Record<string, StageConfig>): Task[] => {
  if (!existingTasks.length) return [];
  
  // If we have 3 or fewer tasks already, just assign them to our 3 steps
  if (existingTasks.length <= 3) {
    return existingTasks.map((task, idx) => {
      const stepKeys = Object.keys(stageConfig);
      return {
        ...task,
        stepOrder: idx + 1,
        taskName: stageConfig[stepKeys[idx]].title,
        description: stageConfig[stepKeys[idx]].description
      };
    });
  }
  
  // Otherwise, create 3 new tasks based on our config
  const stepKeys = Object.keys(stageConfig);
  
  return stepKeys.map((key, idx) => {
    // Find tasks that might belong to this step based on position in the workflow
    const startIdx = Math.floor((idx * existingTasks.length) / 3);
    const endIdx = Math.floor(((idx + 1) * existingTasks.length) / 3);
    
    // Use first task in the range as a template
    const templateTask = existingTasks[startIdx];
    
    // Find the most advanced status in this range
    let mostAdvancedStatus = "Pending";
    let completedDate = null;
    
    for (let i = startIdx; i < endIdx; i++) {
      if (i >= existingTasks.length) break;
      const task = existingTasks[i];
      
      if (task.status === "Completed") {
        mostAdvancedStatus = "Completed";
        completedDate = task.completedDate || completedDate;
      } else if (task.status === "In Progress" && mostAdvancedStatus !== "Completed") {
        mostAdvancedStatus = "In Progress";
      }
    }
    
    // Create a new task for this step
    return {
      ...templateTask,
      id: templateTask.id + `-step-${idx + 1}`,
      taskName: stageConfig[key].title,
      description: stageConfig[key].description,
      status: mostAdvancedStatus,
      completedDate: mostAdvancedStatus === "Completed" ? completedDate : null,
      stepOrder: idx + 1
    };
  });
};

// Main component - Cleaner with state management and data fetching separated
export default function OrderTasks({ orderId, currentUser }: OrderTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    priority: "",
    startDate: "",
    dueDate: "",
    completedDate: "",
    notes: "",
    status: "",
  });
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const stageConfigs = useStageConfigs();

  useEffect(() => {
    fetchTasks();
  }, [orderId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await httpVinLaundry.get(`/orders/${orderId}/tasks`);
      
      // Get original tasks
      const originalTasks = (response.payload as { items: Task[] }).items;
      
      // Transform to 3-step workflow
      const threeStepTasks = mapTasksToThreeSteps(originalTasks, stageConfigs);
      
      setTasks(threeStepTasks);
      
      // Find the first incomplete task
      const currentStepIndex = threeStepTasks.findIndex((task: Task) => task.status !== "Completed");
      setCurrentStep(currentStepIndex === -1 ? threeStepTasks.length : threeStepTasks[currentStepIndex].stepOrder || 1);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách công việc.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setCurrentTask(task);
    setFormData({
      taskName: task.taskName,
      description: task.description || "",
      priority: task.priority,
      startDate: task.startDate || "",
      dueDate: task.dueDate || "",
      completedDate: task.completedDate || "",
      notes: task.notes || "",
      status: task.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!currentTask) return;

    try {
      const isCompleting = formData.status === "Completed" && currentTask.status !== "Completed";
      
      const payload = {
        taskCode: currentTask.taskCode,
        orderId: currentTask.orderId,
        employeeId: currentUser?.id || currentTask.employeeId,
        taskName: formData.taskName,
        description: formData.description,
        priority: formData.priority,
        startDate: formData.startDate || null,
        dueDate: formData.dueDate || null,
        completedDate: isCompleting ? new Date().toISOString() : formData.completedDate || null,
        assignedBy: currentUser?.id || currentTask.assignedBy,
        notes: formData.notes,
        status: formData.status,
      };

      await httpVinLaundry.put(`/tasks/${currentTask.id}`, payload);
      
      toast({
        title: "Thành công",
        description: isCompleting ? "Hoàn thành công việc thành công!" : "Cập nhật công việc thành công",
        variant: "default",
      });
      
      setIsEditDialogOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật công việc.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="shadow-md border-gray-200 mb-6 overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
          <CardTitle className="text-lg flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-purple-600" />
            Tiến trình xử lý đơn hàng
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4 px-4 pb-2">
          {loading ? (
            <LoadingState />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {/* Progress bar */}
              <ProgressBar 
                completedCount={tasks.filter(t => t.status === "Completed").length} 
                totalCount={tasks.length} 
              />
              
              {/* Vertical timeline */}
              <VerticalTimeline 
                tasks={tasks} 
                currentStep={currentStep}
                stageConfigs={stageConfigs}
                onEditTask={handleEditClick}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Edit Dialog */}
      <TaskEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentTask={currentTask}
        formData={formData}
        onChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}