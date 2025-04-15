"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { RootState } from "@/redux/store";
import {
  adminNavItems,
  managerNavItems,
  laundryNavItems,
  settingAdminItems,
} from "@/constants/sidebar/route";
import SidebarSkeleton from "./sidebar-sekeleton";
import { TNavItem, TSettingItem } from "@/types/SideBar";
import { NavProjects } from "./nav-projects";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user.user);
  const [navItems, setNavItems] = useState<TNavItem[]>([]);
  const [settingItems, setSettingItems] = useState<TSettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        setNavItems(adminNavItems);
        setSettingItems(settingAdminItems);
      } else if (user.position === "" || user.role === "Manager") {
        if (user.role === "Manager" && user.position === "ManageLaundry") {
          setNavItems(laundryNavItems);
        } else {
          setNavItems(managerNavItems);
        }
      } else {
        setNavItems([]);
      }
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || !user) {
    return <SidebarSkeleton />;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        {settingItems ? <NavProjects settingItems={settingItems} /> : null}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
