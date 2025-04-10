import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/apis/laudry/employee";
import { User, Phone, Mail, Calendar, Briefcase, BadgeCheck } from "lucide-react";

interface EmployeeDetailProps {
  employee: Employee | null;
  loading: boolean;
  compact?: boolean;
  className?: string;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  loading,
  compact = false,
  className = "",
}) => {
  if (loading) {
    return (
      <Card className={`p-4 animate-pulse ${className}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card className={`p-4 bg-gray-50 border-gray-200 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-100 h-10 w-10 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Không có thông tin nhân viên</p>
          </div>
        </div>
      </Card>
    );
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (compact) {
    return (
      <Card className={`p-3 border hover:shadow-sm transition-all ${className}`}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            {employee.id ? (
              <AvatarImage src={employee.id} alt={employee.fullName} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(employee.fullName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium text-sm">{employee.fullName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" />
              {employee.employeeCode}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 border hover:shadow-sm transition-all ${className}`}>
      <div className="flex gap-4">
        <Avatar className="h-16 w-16 border">
          {employee.id ? (
            <AvatarImage src={employee.id} alt={employee.fullName} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials(employee.fullName)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{employee.fullName}</h3>
            <Badge variant="outline" className={getStatusColor(employee.status)}>
              {employee.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            {employee.employeeCode}
          </p>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {employee.position && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{employee.position}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{employee.phone}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="truncate">{employee.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{formatDate(employee.hireDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeDetail;