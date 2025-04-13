"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Icons } from "@/constants/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const activeCondition = (url: string) => pathname === url;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon =
            item.icon && Icons[item.icon as keyof typeof Icons]
              ? Icons[item.icon as keyof typeof Icons]
              : Icons.logo;

          const isChildActive = item.items?.some((subItem) =>
            activeCondition(subItem.url)
          );

          const isActive = activeCondition(item.url);

          return item?.items && item?.items?.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isChildActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className={`${
                      isChildActive && !isActive
                        ? "bg-[hsl(var(--sidebar-accent-blur))]/80 backdrop-blur-lg dark:bg-sidebar-accent"
                        : ""
                    }`}
                  >
                    {item.icon && <Icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const SubIcon =
                        subItem.icon &&
                        Icons[subItem.icon as keyof typeof Icons]
                          ? Icons[subItem.icon as keyof typeof Icons]
                          : Icons.logo;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={activeCondition(subItem.url)}
                            size="md"
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && <SubIcon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
              >
                <Link href={item.url}>
                  <Icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
