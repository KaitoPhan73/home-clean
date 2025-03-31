"use client";
import React from "react";

import dynamic from "next/dynamic";
import HeaderMain from "@/components/header-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppSidebar = dynamic(
  () => import("@/components/app-sidebar").then((mod) => mod.AppSidebar),
  {
    ssr: false,
  }
);
const LayoutIndex = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar variant="floating" collapsible="icon" />
      <SidebarInset>
        <HeaderMain className="sticky top-0 z-auto w-full" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutIndex;
