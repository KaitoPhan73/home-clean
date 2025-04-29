import { TNavItem, TSettingItem } from "@/types/SideBar";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
} from "lucide-react";
import { PATHS } from "../path";
export const data = {
  user: {
    name: "Nguyen Van A",

    email: "nguyenvana@gmail.com",

    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "ADMIN DASHBOARD",

      logo: GalleryVerticalEnd,

      plan: "HomePLus",
    },

    {
      name: "Acme Corp.",

      logo: AudioWaveform,

      plan: "Startup",
    },

    {
      name: "Evil Corp.",

      logo: Command,

      plan: "Free",
    },
  ],

  projects: [
    {
      name: "Design Engineering",

      url: "#",

      icon: Frame,
    },

    {
      name: "Sales & Marketing",

      url: "#",

      icon: PieChart,
    },

    {
      name: "Travel",

      url: "#",

      icon: Map,
    },
  ],
};
// **Navigation cho Admin**
export const adminNavItems: TNavItem[] = [
  {
    title: "Doanh Thu & Báo Cáo",
    url: "#",
    icon: "chart",
    isActive: false,
    items: [
      {
        title: "Doanh Thu Dịch Vụ",
        url: PATHS.admin.revenues,
        icon: "grMoney",
        shortcut: ["r", "a"],
      },
      {
        title: "Các Giao Dịch",
        url: PATHS.admin.transactions,
        icon: "badgeDollarSign",
        shortcut: ["r", "s"],
      },
      // {
      //   title: "Doanh thu Giao Dịch",
      //   url: PATHS.admin.transactionRevenue,
      //   icon: "handCoins",
      //   shortcut: ["r", "s"],
      // },
      {
        title: "Báo Cáo",
        url: PATHS.admin.feedbacks,
        icon: "feedback",
        shortcut: ["r", "s"],
      },
    ],
  },
  {
    title: "Quản Lí Tài Khoản",
    url: "#",
    icon: "list",
    isActive: false,
    items: [
      {
        title: "Điều Phối Viên",
        url: PATHS.admin.managers,
        icon: "manager",
        shortcut: ["a", "m"],
      },
      {
        title: "Nhân Viên",
        url: PATHS.admin.staffs,
        icon: "staff",
        shortcut: ["a", "s"],
      },
      // {
      //   title: "Nhân Viên Giặt Sấy",
      //   url: PATHS.admin.staffs,
      //   icon: "staff",
      //   shortcut: ["a", "s"],
      // },
      {
        title: "Người Dùng",
        url: PATHS.admin.users,
        icon: "users",
        shortcut: ["a", "u"],
      },
      {
        title: "Ví người dùng",
        url: PATHS.admin.wallets,
        icon: "wallet",
        shortcut: ["a", "m"],
      },
    ],
  },
  {
    title: "Quản Lí Địa Điểm",
    url: "#",
    icon: "dashboard",
    isActive: false,
    items: [
      {
        title: "Khu Vực",
        url: PATHS.admin.areas,
        icon: "filter",
        shortcut: ["r", "a"],
      },
      {
        title: "Cụm Khu Vực",
        url: PATHS.admin.clusters,
        icon: "kanban",
        shortcut: ["r", "s"],
      },
      {
        title: "Tòa Nhà",
        url: PATHS.admin.buildings,
        icon: "building",
        shortcut: ["r", "p"],
      },
      {
        title: "Căn Hộ",
        url: PATHS.admin.houses,
        icon: "home",
        shortcut: ["r", "p"],
      },
      {
        title: "Phòng",
        url: PATHS.admin.rooms,
        icon: "post",
        shortcut: ["r", "p"],
      },
    ],
  },
  {
    title: "Quản Lí Dịch Vụ",
    url: "#",
    icon: "product",
    isActive: false,
    items: [
      {
        title: "Phân Loại",
        url: PATHS.admin.serviceCategories,
        icon: "boxes",
        shortcut: ["r", "a"],
      },
      {
        title: "Dịch Vụ",
        url: PATHS.admin.services,
        icon: "product",
        shortcut: ["r", "s"],
      },
      {
        title: "Gói Dịch Vụ",
        url: PATHS.admin.serviceInHouseTypes,
        icon: "package",
        shortcut: ["r", "s"],
      },
    ],
  },
  {
    "title": "Quản Lí Giặt Sấy",
    "url": "#",
    "icon": "store",
    "isActive": false,
    "items": [
      {
        "title": "Các Đơn Hàng",
        "url": PATHS.admin.laundryOrders,
        "icon": "cart",
        "shortcut": ["r", "a"]
      },
      // {
      //   "title": "Lịch sử đơn hàng",
      //   "url": PATHS.admin.orderHistory,
      //   "icon": "history",
      //   "shortcut": ["r", "s"]
      // },
      // {
      //   "title": "Các nhiệm vụ",
      //   "url": PATHS.admin.tasks,
      //   "icon": "tasks",
      //   "shortcut": ["r", "s"]
      // },
      {
        "title": "Loại Đồ Dùng",
        "url": PATHS.admin.itemTypes,
        "icon": "product",
        "shortcut": ["r", "s"]
      },
      {
        "title": "Loại Dịch Vụ",
        "url": PATHS.admin.serviceTypes,
        "icon": "package",
        "shortcut": ["r", "s"]
      },
      {
        "title": "Các Dịch Vụ Bổ Sung",
        "url": PATHS.admin.additionalServices,
        "icon": "plusBox",
        "shortcut": ["r", "s"]
      }
    ]
  },
  {
    title: "Quản Lí Nhóm",
    url: PATHS.admin.groups,
    icon: "users",
    shortcut: ["s", "h"],
    isActive: false,
    items: [],
  },
];

export const managerNavItems: TNavItem[] = [
  {
    title: "Nhóm Của Tôi",
    url: PATHS.manager.groups,
    icon: "staff",
    isActive: false,
    items: [],
  },

  // {
  //   title: "Ca Làm Việc",
  //   url: PATHS.manager.timeSlots,
  //   icon: "clock",
  //   isActive: false,
  //   items: [],
  // },
  {
    title: "Đơn Hàng & Phân Công",
    url: PATHS.manager.orderAssignment,
    icon: "tasks",
    isActive: false,
    items: [],
  },
  {
    title: "Hồ Sơ",
    url: PATHS.manager.profile,
    icon: "user",
    isActive: false,
    items: [],
  },
];

export const laundryNavItems: TNavItem[] = [
  {
    title: "Giặt Sấy",
    url: PATHS.laundry.orders,
    icon: "tasks",
    isActive: false,
    items: [],
  },
  {
    title: "Nhân Viên",
    url: PATHS.laundry.employees,
    icon: "user",
    isActive: false,
    items: [],
  },
];

export const staffNavItems: TNavItem[] = [
  {
    title: "Nhiệm vụ của tôi",
    url: PATHS.staff.myTasks,
    icon: "tasks",
    shortcut: ["m", "t"],
    isActive: false,
    items: [],
  },
  {
    title: "Lịch làm việc",
    url: PATHS.staff.schedule,
    icon: "calendar",
    shortcut: ["s", "c"],
    isActive: false,
    items: [],
  },
  {
    title: "Hướng dẫn",
    url: PATHS.staff.guides,
    icon: "info",
    isActive: false,
    items: [],
  },
  {
    title: "Phản hồi",
    url: PATHS.staff.feedback,
    icon: "feedback",
    shortcut: ["f", "b"],
    isActive: false,
    items: [],
  },
];


export const settingAdminItems: TSettingItem[] = [
  {
    name: "Ca làm việc",
    url: "/admin/time-slots",
    icon: "calendarLock",
  },
  // {
  //   name: "Hồ sơ",
  //   url: "/admin/profile",
  //   icon: "user",
  // },
];
