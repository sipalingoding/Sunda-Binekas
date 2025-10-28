"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogCloseButton({
  open,
  onClose,
  title = "Bagikeun",
  description = "Dongeng ieu tiasa dibagikeun kucara salin link dihandap ieu",
  link,
}: {
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
  description?: string;
  link: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="  bg-white 
          dark:bg-neutral-900 
          text-black 
          dark:text-white 
          sm:max-w-md 
          rounded-2xl 
          shadow-lg 
          border border-gray-200 "
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <input
            value={link}
            readOnly
            className="border rounded p-2 w-full text-center bg-gray-50 dark:bg-neutral-800"
          />
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={() => onClose(false)}
            className="mt-4 w-full"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
