"use client";

import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import "../i18n";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Halaman tanpa sidebar
  const hideSidebar =
    pathname?.startsWith("/login") || pathname?.startsWith("/register");

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 border-b bg-background sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="h-4 data-[orientation=vertical]:h-4"
          />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
