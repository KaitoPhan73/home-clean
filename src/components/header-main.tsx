"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
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
  const pathname = usePathname();
  const router = useRouter();
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

      <div className="flex items-center gap-4 ml-auto">
        <NotificationBell />
        <ModeToggle />
      </div>
    </header>
  );
};

export default HeaderMain;
