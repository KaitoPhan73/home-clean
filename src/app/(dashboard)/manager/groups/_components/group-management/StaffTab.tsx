/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import {
  Users,
  RefreshCw,
  UserCheck,
  UserX,
  Search,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  Phone,
  Package,
} from "lucide-react";
import { getAllStaffStatusReady } from "@/apis/staff";
import StaffOrdersPopup from "@/app/(dashboard)/manager/groups/_components/group-management/Staff-Detail/StaffOrdersView";

interface Staff {
  id: string;
  status: "Ready" | "Offline";
  lastUpdated: string;
  fullName: string;
  phoneNumber: string;
}

interface StaffTabProps {
  staffData: Staff[];
  onReload: () => void;
  loading: boolean;
  message: string | null;
  groupId: string;
}

const StaffOrdersButton = ({ staff }: { staff: Staff }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Package size={12} className="mr-1" />
        Đơn Hàng
      </button>
      <StaffOrdersPopup
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        staffId={staff.id}
        staffName={staff.fullName}
      />
    </>
  );
};

const StaffCard = ({ staff }: { staff: Staff }) => {
  const date = new Date(staff.lastUpdated);
  const formattedDate = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-px">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`p-2 rounded-full mr-2 ${
              staff.status === "Ready"
                ? "bg-gradient-to-br from-green-400 to-emerald-500"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
          >
            {staff.status === "Ready" ? (
              <UserCheck size={16} className="text-white" />
            ) : (
              <UserX size={16} className="text-white" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 text-sm">{staff.fullName}</h4>
            <div className="text-xs text-gray-500 space-y-1 mt-1">
              <div className="flex items-center">
                <Phone size={12} className="mr-1 text-blue-500" />
                {staff.phoneNumber}
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1 text-blue-500" />
                {formattedDate}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
              staff.status === "Ready" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {staff.status === "Ready" ? (
              <CheckCircle2 size={12} className="mr-1" />
            ) : (
              <XCircle size={12} className="mr-1" />
            )}
            {staff.status === "Ready" ? "Sẵn Sàng" : "Ngoại Tuyến"}
          </span>
          <p className="text-xs text-gray-500 flex items-center">
            <Shield size={10} className="mr-1" />
            ID: {staff.id.substring(0, 8)}...
          </p>
          <StaffOrdersButton staff={staff} />
        </div>
      </div>
    </div>
  );
};

const StaffTab = ({ staffData, onReload, loading, message, groupId }: StaffTabProps) => {
  const [readyStaff, setReadyStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const stickyRef = useRef<HTMLDivElement>(null);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);

  useEffect(() => {
    setAllStaff(staffData);
  }, [staffData]);

  useEffect(() => {
    const fetchReadyStaff = async () => {
      try {
        const response = await getAllStaffStatusReady(groupId);
        const normalizedStaff = Array.isArray(response) ? response : [];
        setReadyStaff(normalizedStaff as Staff[]);
      } catch (error) {
        console.error("Error fetching ready staff:", error);
      }
    };

    fetchReadyStaff();

    const observer = new IntersectionObserver(
      ([entry]) => {
        const stickyElement = document.getElementById("sticky-ready-staff");
        if (stickyElement) {
          if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            stickyElement.classList.add("sticky-active");
          } else {
            stickyElement.classList.remove("sticky-active");
          }
        }
      },
      { threshold: 0, rootMargin: "-1px" }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, [groupId]);

  const filteredStaff = allStaff.filter(
    (staff) =>
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || staff.phoneNumber.includes(searchTerm)
  );

  const readyStaffCount = readyStaff.length;
  const totalStaffCount = allStaff.length;
  const readyPercentage = totalStaffCount > 0 ? Math.round((readyStaffCount / totalStaffCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-blue-600 p-3 rounded-lg shadow-lg mr-4">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Quản Lý Nhân Viên</h2>
              <p className="text-sm text-gray-600 mt-1">Theo dõi và quản lý trạng thái nhân viên trong nhóm</p>
            </div>
          </div>
          <button
            onClick={onReload}
            disabled={loading}
            className={`flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
            }`}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Đang Tải..." : "Cập Nhật Trạng Thái"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-white flex items-center ${
            message.includes("thành công") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.includes("thành công") ? (
            <CheckCircle2 size={18} className="mr-2" />
          ) : (
            <XCircle size={18} className="mr-2" />
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng Nhân Viên</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalStaffCount}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nhân Viên Sẵn Sàng</p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">{readyStaffCount}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tỷ Lệ Sẵn Sàng</p>
              <h3 className="text-2xl font-bold text-purple-600 mt-1">{readyPercentage}%</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${readyPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-base font-semibold text-gray-800 flex items-center">
            <Users size={16} className="mr-1 text-blue-600" />
            Tất Cả Nhân Viên ({filteredStaff.length})
          </h3>
          {filteredStaff.length > 0 ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {filteredStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <Users size={40} className="text-gray-300 mb-2" />
              <p className="font-medium">Không tìm thấy nhân viên</p>
              {searchTerm && <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>}
            </div>
          )}
        </div>

        <div ref={stickyRef} className="lg:col-span-5">
          <div id="sticky-ready-staff" className="bg-white rounded-lg border border-green-100 shadow-sm p-4 space-y-3">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <UserCheck size={16} className="mr-1 text-green-600" />
              Nhân Viên Sẵn Sàng ({readyStaff.length})
            </h3>
            {readyStaff.length > 0 ? (
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {readyStaff.map((staff) => (
                  <StaffCard key={staff.id} staff={staff} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                <UserCheck size={36} className="text-gray-300 mb-2" />
                <p className="font-medium">Không có nhân viên sẵn sàng</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        #sticky-ready-staff.sticky-active {
          position: fixed;
          top: 1rem;
          right: 1rem;
          width: calc((100% - 2rem) * 5 / 12);
          z-index: 10;
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 0.5rem;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 1024px) {
          #sticky-ready-staff.sticky-active {
            position: static;
            width: 100%;
            box-shadow: none;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StaffTab;