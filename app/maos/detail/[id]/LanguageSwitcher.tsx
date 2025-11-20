"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export default function LanguageSwitcher({
  onChange,
  available,
}: {
  onChange: (lang: "su" | "id") => void;
  available: boolean;
}) {
  if (!available) return null;

  return (
    <Select defaultValue="su" onValueChange={(v) => onChange(v as any)}>
      <SelectTrigger className="w-auto h-auto p-2 bg-gray-700 text-white rounded-md border-none shadow-none">
        <Languages className="w-5 h-5" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto bg-white">
        <SelectItem value="id">Bahasa Indonesia</SelectItem>
        <SelectItem value="su">Bahasa Sunda</SelectItem>
      </SelectContent>
    </Select>
  );
}
