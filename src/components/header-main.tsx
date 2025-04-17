/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LucideLogOut } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationBell from "@/components/NotificationBell";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderMainProps {
  className?: string;
}

const HeaderMain = ({ className }: HeaderMainProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const shouldShowBack = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length < 3) return false;
    return segments.slice(2).some((segment) => segment.length > 8);
  };

  return (
    <header
      className={`flex h-12 shrink-0 items-center gap-2 border-b px-4 ${
        className || ""
      }`}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />

        {shouldShowBack() && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-1 px-2"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quay lại trang trước</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />
        <ModeToggle />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2 mr-0">
          <Button
            variant="ghost"
            onClick={() => router.push("/logout")}
            className="text-gray-700 bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 hover:text-destructive transition-all duration-600 ease-in-out font-medium px-2 py-1 rounded-lg hover:shadow-sm flex items-center gap-1"
          >
            <LucideLogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
