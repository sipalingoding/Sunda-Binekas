"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header/header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen p-12 relative">
      <div className="flex flex-col gap-2 items-center">
        <Header />
        <Sidebar />
      </div>

      <main className="flex-1">{children}</main>
    </div>
  );
}
