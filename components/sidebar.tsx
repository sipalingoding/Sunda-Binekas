// "use client";

// import { GoHome } from "react-icons/go";
// import { FaBookReader } from "react-icons/fa";
// import { FaEdit } from "react-icons/fa";
// import { FaShareNodes } from "react-icons/fa6";
// import { FaGift } from "react-icons/fa6";
// import { HiInformationCircle } from "react-icons/hi";
// import { useRouter } from "next/navigation";

// // Tambah tipe prop
// const Sidebar = () => {
//   const router = useRouter();
//   return (
//     <div
//       className="flex flex-col w-[96px] h-[700px] items-center justify-between rounded-2xl py-6 px-2 gap-6 absolute left-8 top-28 z-20"
//       style={{
//         backgroundColor: "#abd7d3",
//       }}
//     >
//       <GoHome
//         size={18}
//         className="text-green-800 hover:cursor-pointer"
//         onClick={() => router.push("/")}
//       />

//       <FaBookReader
//         size={18}
//         className="text-green-800 hover:cursor-pointer"
//         onClick={() => router.push("/maos")}
//       />

//       <div>
//         <FaEdit
//           size={18}
//           className="text-green-800 hover:cursor-pointer"
//           onClick={() => router.push("/nyerat")}
//         />
//       </div>

//       <FaShareNodes
//         size={18}
//         className="text-green-800 hover:cursor-pointer"
//         onClick={() => router.push("/nyiarkeun")}
//       />

//       <FaGift
//         size={18}
//         className="text-green-800 hover:cursor-pointer"
//         onClick={() => router.push("/rereongan")}
//       />

//       <HiInformationCircle
//         size={18}
//         className="text-green-800 hover:cursor-pointer"
//         onClick={() => router.push("/warta")}
//       />
//     </div>
//   );
// };

// export default Sidebar;

"use client";

import { useState } from "react";
import { ChevronDown, Folder, Book, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { UserCard } from "./user-card";

export function Sidebar() {
  const [openPlayground, setOpenPlayground] = useState(false);

  return (
    <aside className="w-64 border-r bg-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="font-semibold text-lg">
            <span className="font-bold">Sunda</span> Binekas
          </h1>
          <p className="text-xs text-muted-foreground">Web Dongeng Sunda</p>
        </div>

        {/* Menu */}
        <nav className="p-2">
          <SidebarItem
            icon={Folder}
            label="Playground"
            open={openPlayground}
            onClick={() => setOpenPlayground(!openPlayground)}
            subItems={[
              { label: "History", href: "#" },
              { label: "Starred", href: "#" },
              { label: "Settings", href: "#" },
            ]}
          />
          <SidebarItem
            icon={Book}
            label="Models"
            subItems={[{ label: "All Models", href: "#" }]}
          />
          <SidebarItem icon={Book} label="Documentation" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* User section */}
      <div className="p-4 border-t">
        {/* <UserCard
          name="shadcn"
          email="m@example.com"
          // avatar="https://api.dicebear.com/9.x/thumbs/svg?seed=shadcn"
        /> */}
      </div>
    </aside>
  );
}
