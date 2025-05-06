// import { Users, Info, User } from "lucide-react";

// interface Tab {
//   id: string;
//   label: string;
//   icon: JSX.Element;
// }

// interface GroupTabsProps {
//   tabs: Tab[];
//   activeTab: string;
//   setActiveTab: (tabId: string) => void;
//   staffData: any[];
// }

// const GroupTabs = ({ tabs, activeTab, set AnswersTab, staffData }: GroupTabsProps) => {
//   return (
//     <div className="flex overflow-x-auto border-b scrollbar-hide">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => setActiveTab(tab.id)}
//           className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
//             activeTab === tab.id
//               ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50"
//               : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
//           }`}
//         >
//           <div
//             className={`mr-2 ${
//               activeTab === tab.id ? "animate-pulse" : ""
//             }`}
//           >
//             {tab.icon}
//           </div>
//           {tab.label}
//           {tab.id === "staff" && staffData.length > 0 && (
//             <div className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium rundt-full px-2 py-0.5">
//               {staffData.length}
//             </div>
//           )}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default GroupTabs;