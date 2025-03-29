import { TNavItem } from "@/types/SideBar";
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
    title: "Quản lý nhóm",
    url: PATHS.admin.groups,
    icon: "users",
    shortcut: ["s", "h"],
    isActive: false,
    items: [],
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
        icon: "userPlus",
        shortcut: ["a", "m"],
      },
      {
        title: "Nhân Viên",
        url: PATHS.admin.staffs,
        icon: "employee",
        shortcut: ["a", "s"],
      },
      {
        title: "Người Dùng",
        url: PATHS.admin.users,
        icon: "users",
        shortcut: ["a", "u"],
      },
    ],
  },

  {
    title: "Khu vực",
    url: "#",
    icon: "dashboard",
    isActive: false,
    items: [
      {
        title: "Quản lí khu vực",
        url: PATHS.admin.areas,
        icon: "filter",
        shortcut: ["r", "a"],
      },
      {
        title: "Quản lí cụm khu vực",
        url: PATHS.admin.clusters,
        icon: "kanban",
        shortcut: ["r", "s"],
      },
      {
        title: "Quản lí tòa nhà",
        url: PATHS.admin.buildings,
        icon: "building",
        shortcut: ["r", "p"],
      },
      {
        title: "Quản lí căn hộ",
        url: PATHS.admin.houses,
        icon: "home",
        shortcut: ["r", "p"],
      },
      {
        title: "Quản lí phòng",
        url: PATHS.admin.rooms,
        icon: "post",
        shortcut: ["r", "p"],
      },
    ],
  },
  {
    title: "Dịch Vụ",
    url: "#",
    icon: "product",
    isActive: false,
    items: [
      {
        title: "Phân Loại Dịch Vụ",
        url: PATHS.admin.serviceCategories,
        icon: "page",
        shortcut: ["r", "a"],
      },
      {
        title: "Loại Dịch Vụ",
        url: PATHS.admin.services,
        icon: "post",
        shortcut: ["r", "s"],
      },
    ],
  },
  {
    title: "Doanh Thu & Báo Cáo",
    url: "#",
    icon: "chart",
    isActive: false,
    items: [
      {
        title: "Doanh Thu Tổng",
        url: PATHS.admin.revenues,
        icon: "page",
        shortcut: ["r", "a"],
      },
      {
        title: "Các Giao Dịch",
        url: PATHS.admin.transactions,
        icon: "post",
        shortcut: ["r", "s"],
      },
    ],
  },
];


export const managerNavItems: TNavItem[] = [
  {
    title: "Quản Lí Nhóm",
    url: PATHS.manager.groups,
    icon: "staff",
    isActive: false,
    items: [],
  },
  
  {
    title: "Ca Làm Việc",
    url: PATHS.manager.timeSlots,
    icon: "clock",
    isActive: false,
    items: [],
  },
  {
    title: "Trạng Thái Đơn Hàng",
    url: PATHS.manager.orderAssignment,
    icon: "tasks",
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

// Navigation cho Store (Cửa hàng)
export const storeNavItems: TNavItem[] = [
  {
    title: "Tổng quan",
    url: "/store/dashboard",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Sản phẩm",
    url: "#",
    icon: "box",
    isActive: false,
    items: [
      {
        title: "Tất cả sản phẩm",
        url: "/store/products",
        icon: "boxes",
        shortcut: ["p", "a"],
      },
      {
        title: "Thêm sản phẩm",
        url: "/store/products/add",
        icon: "plusBox",
        shortcut: ["p", "n"],
      },
      {
        title: "Danh mục",
        url: "/store/products/categories",
        icon: "category",
        shortcut: ["p", "c"],
      },
    ],
  },
  {
    title: "Đơn hàng",
    url: "#",
    icon: "boxes",
    isActive: false,
    items: [
      {
        title: "Tất cả đơn hàng",
        url: "/store/orders",
        icon: "list",
        shortcut: ["o", "a"],
      },
      {
        title: "Chờ xử lý",
        url: "/store/orders/pending",
        icon: "clock",
        shortcut: ["o", "p"],
      },
      {
        title: "Đang xử lý",
        url: "/store/orders/processing",
        icon: "loader",
        shortcut: ["o", "r"],
      },
      {
        title: "Hoàn thành",
        url: "/store/orders/completed",
        icon: "check",
        shortcut: ["o", "c"],
      },
    ],
  },
  {
    title: "Doanh thu",
    url: "/store/revenue",
    icon: "chart",
    shortcut: ["r", "e"],
    isActive: false,
    items: [],
  },
  {
    title: "Thông tin cửa hàng",
    url: "/store/profile",
    icon: "store",
    shortcut: ["s", "p"],
    isActive: false,
    items: [],
  },
];
