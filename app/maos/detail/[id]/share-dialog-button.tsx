"use client";

import { useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { DialogCloseButton } from "@/components/dialog-close-button/DialogCloseButton";

export default function ShareDialogButton({ link }: { link: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <GoShareAndroid size={15} color="white" />
      </div>

      {open && (
        <DialogCloseButton
          title="Bagikeun"
          description="Dongeng ieu tiasa dibagikeun kucara salin link dihandap ieu"
          link={link}
          onClose={() => setOpen(false)}
          open
        />
      )}
    </>
  );
}
