"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { RootState } from "@/redux/store";
import {
  adminNavItems,
  managerNavItems,
  laundryNavItems,
  data,
} from "@/constants/sidebar/route";
import SidebarSkeleton from "./sidebar-sekeleton";
import { TNavItem } from "@/types/SideBar";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user.user);
  const [navItems, setNavItems] = useState<TNavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        setNavItems(adminNavItems);
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
