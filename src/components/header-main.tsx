/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationBell from "@/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HeaderMainProps {
  className?: string;
}

const HeaderMain = ({ className }: HeaderMainProps) => {
  const router = useRouter();

  return (
    <header
      className={`flex h-12 shrink-0 items-center gap-2 border-b px-4 ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* <DynamicBreadcrumb className="flex items-center gap-2" /> */}
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <NotificationBell />
        <ModeToggle />

        <div className="flex items-center gap-2 mr-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/logout")}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
