"use client";

import * as React from "react";
import {
  Bot,
  GalleryVerticalEnd,
  SquareTerminal,
  BookOpen,
  PenTool,
  Headphones,
  Users,
  Newspaper,
  Mail,
  Phone,
  BookAudio,
  ShieldUser,
  Mic,
  Languages,
  Speaker,
} from "lucide-react";
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
import Image from "next/image";
// 1. Import hook dari i18next
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<any>(null);
  const [dataUser, setDataUser] = React.useState<any>(null);
  const { t } = useTranslation();

  // 2. Inisialisasi hook i18n
  const { i18n } = useTranslation();

  // Fungsi helper untuk ganti bahasa
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

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
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (userData) setDataUser(userData);
    };
    getUserData();
  }, [user, supabase]);

  // 🧩 Definisi data navigasi utama
  // Data ini akan otomatis diperbarui saat bahasa berubah karena ada di dalam render cycle
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
        title: "Fitur Utama",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: t("sidebar1"),
            url: "/maos",
            icon: BookOpen,
          },
          {
            title: t("sidebar2"),
            url: "/nyerat",
            icon: PenTool,
          },
          {
            title: t("sidebar3"),
            url: "/ngupingkeun",
            icon: Headphones,
          },
          {
            title: t("sidebar4"),
            url: "/ngadeklamasikeun",
            icon: Mic,
          },
        ],
      },
      {
        title: "Bahasa",
        icon: Languages,
        isActive: true,
        items: [
          {
            title: "Basa Sunda",
            url: "#",
            icon: Speaker,
            isActive: i18n.language === "su",
            onClick: () => changeLanguage("su"),
          },
          {
            title: "Bahasa Indonesia",
            url: "#",
            icon: Speaker,
            isActive: i18n.language === "id",
            onClick: () => changeLanguage("id"),
          },
        ],
      },
      {
        title: "Kontak",
        icon: Bot,
        isActive: true,
        items: [
          {
            title: "Email",
            url: "mailto:pukis.dongengsunda@gmail.com",
            icon: Mail,
          },
          {
            title: "Whatsapp",
            url: "https://wa.me/6281221808959",
            icon: Phone,
          },
        ],
      },
    ],

    projects: [
      {
        name: "Modul Guru",
        url: "/404",
        icon: BookAudio,
      },
      {
        name: t("sidebar5"),
        url: "/404",
        icon: Users,
      },
      {
        name: t("sidebar6"),
        url: "/warta",
        icon: Newspaper,
      },
      ...(dataUser?.role === "admin"
        ? [
            {
              name: "Kurator",
              url: "/admin",
              icon: ShieldUser,
            },
          ]
        : []),
    ],
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      className="bg-[#fafafa]"
    >
      <SidebarHeader
        onClick={() => router.replace("/")}
        className="flex flex-row gap-3 items-center overflow-auto group-data-[collapsible=icon]:overflow-hidden cursor-pointer"
      >
        <Image src={"/images/LOGO.png"} width={50} height={50} alt="logo" />
        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
          <span className="font-bold text-3xl">PUKIS</span>
          <span className="text-xs">
            Peta Unik Karuhun Jeung Inovasi Sastra
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Pastikan NavMain mendukung prop onClick pada items */}
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
