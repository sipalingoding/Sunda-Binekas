"use client";

import * as React from "react";
import { Bot, Frame, GalleryVerticalEnd, SquareTerminal } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<any>(null);
  const [dataUser, setDataUser] = React.useState<any>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    getUser();
  }, [supabase]);

  React.useEffect(() => {
    const getUserData = async () => {
      if (!user) return;
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setDataUser(userData);
      }
    };
    getUserData();
  }, [user, supabase]);

  const data = {
    user: {
      name: dataUser?.username,
      email: user?.email,
      avatar: user?.user_metadata?.avatar_url,
    },
    teams: [
      {
        name: "Pukis",
        logo: GalleryVerticalEnd,
        plan: "Web Pangajaran Sunda",
      },
    ],
    navMain: [
      {
        title: "Fitur Utami",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Maos",
            url: "/maos",
          },
          {
            title: "Nyerat",
            url: "/nyerat",
          },
          {
            title: "Ngupingkeun",
            url: "/ngupingkeun",
          },
        ],
      },
      {
        title: "Fitur Tambihan",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Rereongan",
            url: "/404",
          },
          {
            title: "Warta",
            url: "/404",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Modul Guru",
        url: "/admin",
        icon: Frame,
      },
    ],
  };
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      className="bg-[#fafafa]"
    >
      <SidebarHeader>
        <span className="font-bold text-3xl">PUKIS</span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
