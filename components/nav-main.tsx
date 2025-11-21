"use client";

import { ChevronRight, Check, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      onClick?: () => void;
      isActive?: boolean;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isExternal =
                      subItem.url.startsWith("http") ||
                      subItem.url.startsWith("mailto:");

                    const isAction = !!subItem.onClick;

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          {isAction ? (
                            // 🟢 TOMBOL ACTION (BAHASA)
                            <button
                              onClick={subItem.onClick}
                              className="flex w-full items-center gap-2 cursor-pointer text-left"
                              type="button"
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                                /* shrink-0 agar icon tidak gepeng */
                              )}

                              {/* 👇 PERUBAHAN DI SINI 👇 */}
                              <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                {subItem.title}
                              </span>

                              {subItem.isActive && (
                                <Check className="ml-auto h-4 w-4 shrink-0" />
                                /* shrink-0 agar centang tidak gepeng */
                              )}
                            </button>
                          ) : isExternal ? (
                            // EXTERNAL LINK
                            <a
                              href={subItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full"
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{subItem.title}</span>
                            </a>
                          ) : (
                            // INTERNAL LINK
                            <Link
                              href={subItem.url}
                              className="flex items-center gap-2 w-full"
                            >
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
