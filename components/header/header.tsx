import { useRouter } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSupportAgent } from "react-icons/md";

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex gap-2 items-center">
      <CgProfile
        size={30}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/profile")}
      />
      <MdOutlineSupportAgent
        size={30}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/modul")}
      />
    </div>
  );
};

export default Header;
