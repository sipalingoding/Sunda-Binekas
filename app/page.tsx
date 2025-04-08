"use client";

import Image from "next/image";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="relative min-h-screen p-12">
      <Image
        src="/images/BACKGROUND-WEBSUN.jpeg"
        alt="Background"
        className="absolute z-[-1] w-full h-full object-cover"
        fill
        sizes="100vw"
      />
      <Sidebar />
    </div>
  );
}
