import { TGroupResponse } from "@/schema/group.schema";
import { Users, Hash, CheckCircle, AlertCircle } from "lucide-react";

interface GroupHeaderProps {
  group: TGroupResponse;
}

const GroupHeader = ({ group }: GroupHeaderProps) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-4 text-white transform hover:scale-[1.02] transition-transform duration-300">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">{group.name}</h1>
          <div className="flex items-center text-white/80 text-sm">
            <Hash size={14} className="mr-1" />
            <span>{group.code}</span>
          </div>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
          group.status === "Active" ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"
        }`}
      >
        {group.status === "Active" ? (
          <CheckCircle size={14} className="mr-1" />
        ) : (
          <AlertCircle size={14} className="mr-1" />
        )}
        {group.status === "Active" ? "Hoạt Động" : "Không Hoạt Động"}
      </span>
    </div>
  </div>
);

export default GroupHeader;