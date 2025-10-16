"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButtons({ id }: { id: string }) {
  const router = useRouter();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    const res = await fetch(`/api/dongeng/${id}`, {
      method: "PATCH",
    });

    const dataApprove = await res.json();
    setLoadingApprove(false);

    if (!res.ok) {
      alert(dataApprove.error || "Gagal mengubah status");
    } else {
      router.replace("/admin");
      alert(dataApprove.message);
    }
  };

  const handleReject = async () => {
    setLoadingReject(true);
    const res = await fetch(`/api/dongeng/${id}/reject`, {
      method: "PATCH",
    });

    const dataApprove = await res.json();
    setLoadingReject(false);

    if (!res.ok) {
      alert(dataApprove.error || "Gagal mengubah status");
    } else {
      router.replace("/admin");
      alert(dataApprove.message);
    }
  };

  return (
    <div className="flex justify-end items-end gap-2">
      <Button
        variant="destructive"
        disabled={loadingReject}
        onClick={handleReject}
      >
        {loadingReject ? "Memproses..." : "Tolak"}
      </Button>
      <Button
        variant="default"
        className="bg-blue-500 text-white"
        onClick={handleApprove}
        disabled={loadingApprove}
      >
        {loadingApprove ? "Memproses..." : "Tarima"}
      </Button>
    </div>
  );
}
