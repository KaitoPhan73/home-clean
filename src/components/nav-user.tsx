/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChevronDown, Settings, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { TAuthResponse } from "@/schema/auth.schema";

export function NavUser({ user }: { user: TAuthResponse }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gray-100 rounded-md transition-all duration-200"
            >
              <Avatar className="h-9 w-9 rounded-md border border-gray-200 shadow-sm">
                <AvatarImage src={user.fullName} alt={user.fullName} />
                <AvatarFallback className="rounded-md bg-gray-800 text-white font-medium">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-semibold text-gray-800">
                  {user.fullName}
                </span>
                <span className="truncate text-xs text-gray-500">
                  Chức vụ: {user.role}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
