"use client";

import * as React from "react";
import { Bot, Frame, GalleryVerticalEnd, SquareTerminal } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
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
import { useRouter } from "next/navigation";
import { url } from "inspector";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
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
      username: dataUser?.username,
      email: dataUser?.email,
      photo: dataUser?.photo,
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
        icon: SquareTerminal,
        url: "",
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
          {
            title: "Rereongan",
            url: "/404",
          },
          {
            title: "Warta",
            url: "/warta",
          },
        ],
      },
      {
        title: "Kontak",
        icon: Bot,
        isActive: true,
        url: "",
        items: [
          {
            title: "Email",
            url: "",
          },
          {
            title: "Whatsapp",
            url: "",
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
      <SidebarHeader onClick={() => router.replace("/")}>
        <span className="font-bold text-3xl cursor-pointer">PUKIS</span>
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
