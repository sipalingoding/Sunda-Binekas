"use client";

import Image from "next/image";
import { GoHome } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { BsCalendar4Event } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen p-12">
      <Image
        src="/images/BACKGROUND-WEBSUN.jpeg"
        alt="Background"
        className="absolute z-[-1] w-full h-full object-cover"
        fill
        sizes="100vw"
      />
      <div
        className="flex flex-col w-[96px] h-[600px] items-center justify-between rounded-2xl py-6 px-2 gap-6"
        style={{
          background: "rgba(255, 255, 255, 0.70)", // 🔥 Background transparan
          backdropFilter: "blur(2px)", // 🔥 Efek blur kaca
        }}
      >
        <GoHome
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <IoSaveOutline
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <FaMoneyBills
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <BsCalendar4Event
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <IoShareSocialOutline
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <IoMdInformationCircleOutline
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
        />
        <FaRegUser size={24} strokeWidth={1} className="text-green-800" />
        <IoLogOut
          size={24}
          strokeWidth={1}
          className="text-green-800 hover:cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
