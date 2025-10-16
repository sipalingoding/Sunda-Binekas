import { useRouter } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSupportAgent } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logout } from "@/services/authService";

const Header = () => {
  const router = useRouter();

  

  const handleLogout = () => {
    logout()
      .then(() => router.push("/login"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CgProfile
            size={30}
            className="text-green-800 hover:cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#abd7d3]" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <MdOutlineSupportAgent
        size={30}
        className="text-green-800 hover:cursor-pointer"
        onClick={() => router.push("/admin")}
      />
    </div>
  );
};

export default Header;
