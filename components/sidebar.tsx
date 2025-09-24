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
  setIsMaca,
}: {
  setCurrentIndex: (index: number) => void;
  setIsMaca: (isMaca: boolean) => void;
}) => {
  const router = useRouter();
  const usepathname = usePathname();
  const handleClick = (index: number) => {
    setCurrentIndex(index);
    setIsMaca(false);
  };

  return (
    <div
      className="flex flex-col w-[96px] h-[600px] items-center justify-between rounded-2xl py-6 px-2 gap-6 absolute left-12 z-20"
      style={{
        backgroundColor: "#abd7d3",
      }}
    >
      {/* Home -> id:1 -> index 0 */}
      <GoHome
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => handleClick(0)}
      />

      {/* Maos Dongéng -> id:2 -> index 1 */}
      <IoSaveOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => handleClick(1)}
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
          onClick={() => handleClick(4)}
        />
      </div>

      {/* Event -> misal id:3 */}
      <BsCalendar4Event
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => handleClick(2)}
      />

      {/* Nyiarkeun -> id:4 */}
      <IoShareSocialOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => handleClick(3)}
      />

      {/* Warta -> id:6 */}
      <IoMdInformationCircleOutline
        size={18}
        strokeWidth={1}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => handleClick(5)}
      />
    </div>
  );
};

export default Sidebar;
