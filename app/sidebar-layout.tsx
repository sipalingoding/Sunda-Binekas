"use client";

import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Halaman tanpa sidebar
  const hideSidebar =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (hideSidebar) {
    return <>{children}</>; // cuma render isi halaman
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
