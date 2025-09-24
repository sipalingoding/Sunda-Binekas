"use client";

import { GoHome } from "react-icons/go";
import { IoSaveOutline } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { BsCalendar4Event } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";

// Tambah tipe prop
const Sidebar = ({
  setCurrentIndex,
}: {
  setCurrentIndex: (index: number) => void;
}) => {
  const router = useRouter();
  const usepathname = usePathname();

  return (
    <div
      className="flex flex-col w-[96px] h-[600px] items-center justify-between rounded-2xl py-6 px-2 gap-6 absolute left-12"
      style={{
        background: "rgba(255, 255, 255, 0.70)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Home -> id:1 -> index 0 */}
      <GoHome
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => setCurrentIndex(0)}
      />

      {/* Maos Dongéng -> id:2 -> index 1 */}
      <IoSaveOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => setCurrentIndex(1)}
      />

      {/* Udunan -> id:5 -> index 4 */}
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
          onClick={() => setCurrentIndex(4)}
        />
      </div>

      {/* Event -> misal id:3 */}
      <BsCalendar4Event
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => setCurrentIndex(2)}
      />

      {/* Nyiarkeun -> id:4 */}
      <IoShareSocialOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => setCurrentIndex(3)}
      />

      {/* Warta -> id:6 */}
      <IoMdInformationCircleOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => setCurrentIndex(5)}
      />
    </div>
  );
};

export default Sidebar;
