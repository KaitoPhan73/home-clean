import { Icons } from "@/constants/icons";

export type TNavItem = {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: TNavItem[];
};

export type TSettingItem = {
  name: string;
  url: string;
  icon: keyof typeof Icons;
};
