"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // kalau kamu pakai shadcn toast (opsional)
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  userData: {
    id: string;
    username: string;
    email: string;
    gender?: string;
  };
}

export default function ProfileFormClient({ userData }: ProfileFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(userData.username || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Berhasil Tersimpan",
          description: "data berhasil disimpan",
          variant: "success",
        });
        router.replace("/");
      } else {
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal tersimpan",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: err,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full max-w-3xl">
      {/* Username */}
      <div className="grid grid-cols-[150px_1fr] items-center gap-4">
        <label className="text-lg">Nami</label>
        <Input
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-[150px_1fr] items-center gap-4">
        <label className="text-lg">Email</label>
        <Input className="w-full" disabled value={userData.email} />
      </div>

      <div className="w-full flex justify-end pt-4">
        <Button
          className="bg-green-800 text-white"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpen"}
        </Button>
      </div>
    </div>
  );
}
