/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from "react";
import { Info } from "lucide-react";

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  valueClass?: string;
  layout?: "summary" | "detail";
  badge?: "success" | "warning" | "error" | "info" | "none";
}

const InfoItem = ({ 
  icon, 
  label, 
  value, 
  valueClass = "text-gray-800", 
  layout = "summary",
  badge = "none"
}: InfoItemProps) => {
  const getBadgeColor = () => {
    switch (badge) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "";
    }
  };
  
  return (
    <div 
      className={`
        flex items-center gap-3 rounded-lg transition-all duration-200
        ${layout === "summary" 
          ? "bg-white hover:bg-blue-50 hover:shadow-md p-3 border border-gray-50" 
          : "border-b border-gray-100 pb-3 hover:bg-gray-50 py-2"
        }
      `}
    >
      <div className={`
        flex-shrink-0 p-2 rounded-md shadow-sm
        ${layout === "summary" ? "bg-blue-50" : "bg-blue-50"}
      `}>
        {icon}
      </div>
      
      {layout === "summary" ? (
        <div className="flex-grow">
          <div className="text-xs font-medium text-gray-500">{label}</div>
          <div className="flex items-center gap-2">
            <div className={`font-medium ${valueClass} text-sm mt-1`}>
              {value || "—"}
            </div>
            {/* {badge !== "none" && (
              <div className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor()} border mt-1`}>
                <div className="flex items-center">
                  <Info size={10} className="mr-1" />
                  {badge === "info" ? "Thông tin" : 
                   badge === "warning" ? "Cần gán" : 
                   badge === "success" ? "Hoàn thành" : 
                   badge === "error" ? "Lỗi" : ""}
                </div>
              </div>
            )} */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className={`font-medium ${valueClass} text-sm mt-1 sm:mt-0`}>
            {value || "—"}
          </span>
        </div>
      )}
    </div>
  );
};

export default InfoItem;