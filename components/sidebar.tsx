"use client";

import { GoHome } from "react-icons/go";
import { FaBookReader } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import { FaGift } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";

// Tambah tipe prop
const Sidebar = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col w-[96px] h-[700px] items-center justify-between rounded-2xl py-6 px-2 gap-6 absolute left-8 top-28 z-20"
      style={{
        backgroundColor: "#abd7d3",
      }}
    >
      <GoHome
        size={18}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/")}
      />

      <FaBookReader
        size={18}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/maos")}
      />

      <div>
        <FaEdit
          size={18}
          className="text-green-800 hover:cursor-pointer"
          onClick={() => router.push("/nyerat")}
        />
      </div>

      <FaShareNodes
        size={18}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/nyiarkeun")}
      />

      <FaGift
        size={18}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/rereongan")}
      />

      <HiInformationCircle
        size={18}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/warta")}
      />
    </div>
  );
};

export default Sidebar;
