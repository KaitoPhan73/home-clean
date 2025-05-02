import { useState } from "react";
import { TGroupResponse } from "@/schema/group.schema";
import { TAreaResponse } from "@/schema/area.schema";
import { TManagerResponse } from "@/schema/manager.schema";
import { TClusterResponse } from "@/schema/cluster.schema";
import { TServiceResponse } from "@/schema/service.schema";
import { 
  Users, Building2, User, Layers, ClipboardList, 
  Mail, Phone, Calendar, Clock, Hash, 
  CheckCircle, AlertCircle, MapPin, DollarSign, Percent, 
  Shield, Award, Activity, Zap, Sparkles
} from "lucide-react";
import InfoItem from "./InfoItem";

interface EnhancedOverviewTabProps {
  group: TGroupResponse;
  areaInfo: TAreaResponse | null;
  managerInfo: TManagerResponse | null;
  clusters: TClusterResponse[];
  services: TServiceResponse[];
}

const EnhancedOverviewTab = ({ 
  group, 
  areaInfo, 
  managerInfo, 
  clusters, 
  services 
}: EnhancedOverviewTabProps) => {
  const [activeOverlay, setActiveOverlay] = useState<"clusters" | "services" | null>(null);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 rounded-xl p-6 border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 rounded-full opacity-20 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="flex items-center mb-5 relative z-10">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg shadow-md">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-3">Tổng Quan Nhóm</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
              <InfoItem
                icon={<Building2 size={16} className="text-indigo-500" />}
                label="Khu Vực"
                value={areaInfo?.name || "Chưa gán"}
                badge={areaInfo ? "info" : "warning"}
              />
              <InfoItem
                icon={<User size={16} className="text-teal-500" />}
                label="Quản Lý"
                value={managerInfo?.fullName || "Chưa gán"}
                badge={managerInfo ? "info" : "warning"}
              />
              
              <InfoItem
                icon={<Layers size={16} className="text-blue-500" />}
                label="Cụm"
                value={clusters.length > 0 
                  ? clusters.map(c => c.name).join(", ")
                  : "Chưa gán cụm nào"}
                badge={clusters.length > 0 ? "info" : "warning"}
              />
              
              <InfoItem
                icon={<ClipboardList size={16} className="text-purple-500" />}
                label="Dịch Vụ"
                value={services.length > 0 
                  ? services.map(s => s.name).join(", ")
                  : "Chưa gán dịch vụ nào"}
                badge={services.length > 0 ? "info" : "warning"}
              />
              
              <InfoItem
                icon={<Shield size={16} className="text-blue-500" />}
                label="Tên Nhóm"
                value={group.name}
              />
              <InfoItem
                icon={<Hash size={16} className="text-gray-500" />}
                label="Mã Nhóm"
                value={group.code}
              />
              {areaInfo?.address && (
                <InfoItem
                  icon={<MapPin size={16} className="text-red-500" />}
                  label="Địa Chỉ Khu Vực"
                  value={areaInfo.address}
                />
              )}
              <InfoItem
                icon={<Calendar size={16} className="text-orange-500" />}
                label="Ngày Tạo"
                value={new Date(group.createdAt || new Date()).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              />
              
              {areaInfo && (
                <>
                  <InfoItem
                    icon={<Award size={16} className="text-indigo-500" />}
                    label="Mã Khu Vực"
                    value={areaInfo.code || "N/A"}
                  />
                  <InfoItem
                    icon={<Activity size={16} className="text-indigo-500" />}
                    label="Trạng Thái Khu Vực"
                    value={areaInfo.status === "Active" ? "Hoạt Động" : "Không Hoạt Động"}
                    valueClass={areaInfo.status === "Active" ? "text-green-600" : "text-red-600"}
                    badge={areaInfo.status === "Active" ? "success" : "error"}
                  />
                </>
              )}
            </div>
            
            {/* Cluster Details Panel */}
            {activeOverlay === "clusters" && clusters.length > 0 && (
              <div className="absolute inset-x-0 top-0 mt-20 lg:w-2/3 mx-auto bg-white shadow-2xl border border-blue-200 rounded-lg p-4 z-50 max-h-96 overflow-y-auto transform transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between mb-3 sticky top-0 bg-white p-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                      <Layers size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 ml-2">Chi Tiết Cụm ({clusters.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveOverlay(null)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {clusters.map((cluster) => (
                    <div key={cluster.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <span className="bg-blue-100 p-1 rounded-md mr-2">
                              <Zap size={14} className="text-blue-600" />
                            </span>
                            {cluster.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Hash size={12} className="mr-1" />
                            {cluster.code}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                          cluster.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {cluster.status === "Active" ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <AlertCircle size={12} className="mr-1" />
                          )}
                          {cluster.status === "Active" ? "Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Services Details Panel */}
            {activeOverlay === "services" && services.length > 0 && (
              <div className="absolute inset-x-0 top-0 mt-20 lg:w-2/3 mx-auto bg-white shadow-2xl border border-purple-200 rounded-lg p-4 z-50 max-h-96 overflow-y-auto transform transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between mb-3 sticky top-0 bg-white p-2 border-b border-purple-100">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                      <ClipboardList size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 ml-2">Chi Tiết Dịch Vụ ({services.length})</h3>
                  </div>
                  <button 
                    onClick={() => setActiveOverlay(null)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 flex items-center">
                            <span className="bg-purple-100 p-1 rounded-md mr-2">
                              <Sparkles size={14} className="text-purple-600" />
                            </span>
                            {service.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Hash size={12} className="mr-1" />
                            {service.serviceCode}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                          service.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {service.status === "Active" ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <AlertCircle size={12} className="mr-1" />
                          )}
                          {service.status === "Active" ? "Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center text-sm">
                        <span className="bg-green-50 text-green-700 rounded-full px-3 py-1 flex items-center border border-green-100">
                          <DollarSign size={12} className="mr-1" />
                          <span className="font-medium">
                            {service.price.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </span>
                        {service.discount > 0 && (
                          <span className="ml-2 flex items-center text-white text-xs bg-gradient-to-r from-green-500 to-teal-500 px-3 py-1 rounded-full shadow-sm">
                            <Percent size={10} className="mr-1" />
                            Giảm {service.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center mt-6 gap-4 relative z-10">
              <button 
                onClick={() => setActiveOverlay(activeOverlay === "clusters" ? null : "clusters")} 
                disabled={clusters.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all duration-200 ${
                  clusters.length > 0 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-md" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Layers size={16} className="mr-2" />
                {activeOverlay === "clusters" ? "Đóng Chi Tiết Cụm" : "Xem Chi Tiết Cụm"}
              </button>
              
              <button 
                onClick={() => setActiveOverlay(activeOverlay === "services" ? null : "services")} 
                disabled={services.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-all duration-200 ${
                  services.length > 0 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ClipboardList size={16} className="mr-2" />
                {activeOverlay === "services" ? "Đóng Chi Tiết Dịch Vụ" : "Xem Chi Tiết Dịch Vụ"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 rounded-xl shadow-md p-6 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200 rounded-full opacity-20 -translate-y-1/3 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200 rounded-full opacity-20 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="flex items-center mb-5 relative z-10">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-lg shadow-md">
                <User size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 ml-3">Thông Tin Quản Lý</h2>
            </div>           
            {managerInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-teal-500 to-blue-500 text-white p-3 rounded-lg shadow-md">
                      <User size={24} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-800">{managerInfo.fullName}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Hash size={14} className="mr-1" />
                        {managerInfo.code}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-sm ${
                      managerInfo.status === "Active" || !managerInfo.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {managerInfo.status === "Active" || !managerInfo.status ? (
                      <CheckCircle size={12} className="mr-1" />
                    ) : (
                      <AlertCircle size={12} className="mr-1" />
                    )}
                    {managerInfo.status === "Active" || !managerInfo.status ? "Hoạt Động" : "Không Hoạt Động"}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <InfoItem
                    icon={<Mail size={16} className="text-teal-500" />}
                    label="Email"
                    value={managerInfo.email}
                    layout="detail"
                  />
                  <InfoItem
                    icon={<Phone size={16} className="text-teal-500" />}
                    label="Số Điện Thoại"
                    value={managerInfo.phoneNumber}
                    layout="detail"
                  />
                  <InfoItem
                    icon={<Calendar size={16} className="text-teal-500" />}
                    label="Ngày Tạo"
                    value={new Date(managerInfo.createdAt || new Date()).toLocaleDateString()}
                    layout="detail"
                  />
                  <InfoItem
                    icon={<Clock size={16} className="text-teal-500" />}
                    label="Cập Nhật Gần Nhất"
                    value={new Date(managerInfo.updatedAt || new Date()).toLocaleDateString()}
                    layout="detail"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-white rounded-lg shadow-inner">
                <div className="bg-gray-100 p-6 rounded-full mb-3">
                  <User size={48} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Không có thông tin quản lý</p>
                <p className="text-gray-400 text-sm mt-1">Vui lòng gán quản lý cho nhóm này</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOverviewTab;