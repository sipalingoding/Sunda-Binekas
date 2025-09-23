"use client";

import { GoHome } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { BsCalendar4Event } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/authService";

const Sidebar = () => {
  const router = useRouter();
  const usepathname = usePathname();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div
      className="flex flex-col w-[96px] h-[600px] items-center justify-between rounded-2xl py-6 px-2 gap-6 absolute left-12"
      style={{
        background: "rgba(255, 255, 255, 0.70)", // 🔥 Background transparan
        backdropFilter: "blur(2px)", // 🔥 Efek blur kaca
      }}
    >
      <GoHome
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
      />
      <IoSaveOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
      />
            <div
        className={`${
          usepathname == "/sumbangan" ? "bg-green-800" : "bg-transparent"
        } px-4 py-2 rounded-md`}
      >
      <FaMoneyBills
        size={18}
        strokeWidth={1}
        className={`${
          usepathname == "/sumbangan" ? "text-white" : "text-green-800"
        } hover:cursor-pointer`}
        onClick={()=> router.push("/sumbangan")}
      />
      </div>

      <BsCalendar4Event
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
      />
      <IoShareSocialOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
      />
      <IoMdInformationCircleOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
      />
      <div
        className={`${
          usepathname == "/profile" ? "bg-green-800" : "bg-transparent"
        } px-4 py-2 rounded-md`}
      >
        <FaRegUser
          size={18}
          strokeWidth={1}
          className={`${
            usepathname == "/profile" ? "text-white" : "text-green-800"
          } hover:cursor-pointer`}
          onClick={() => router.push("/profile")}
        />
      </div>

      <IoLogOut
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={handleLogout}
      />
    </div>
  );
};

export default Sidebar;
