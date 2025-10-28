"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type DataProps = {
  email: string;
  nohp: string;
};

const ButtonDialog = ({ email, nohp }: DataProps) => {
  return (
    <div className="grid gap-4">
      {/* Email */}
      <div className="grid gap-3 relative">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            disabled
            defaultValue={email}
            className="pr-10" // beri ruang di kanan untuk icon
          />
          <button
            type="button"
            onClick={() => window.open(`mailto:${email}`, "_blank")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <MdEmail size={20} />
          </button>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="grid gap-3 relative">
        <Label htmlFor="whatsapp">Whatsapp</Label>
        <div className="relative">
          <Input
            id="whatsapp"
            name="whatsapp"
            disabled
            defaultValue={nohp}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => {
              const phone = nohp
                ?.replace(/\D/g, "") // hilangkan karakter non-digit
                ?.replace(/^0/, "62"); // ubah awalan 0 ke +62
              window.open(`https://wa.me/${phone}`, "_blank");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
          >
            <FaWhatsapp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonDialog;
