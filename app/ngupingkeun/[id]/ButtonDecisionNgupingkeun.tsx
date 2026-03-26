"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButtonsNgupingkeun({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    const res = await fetch(`/api/dongeng/list-nguping/${id}`, {
      method: "PATCH",
    });

    console.log(res);

    const dataApprove = await res.json();

    console.log(dataApprove);
    setLoadingApprove(false);

    if (!res.ok) {
      toast({
        title: "Data Gagal Disimpen",
        description: dataApprove.error || "Gagal disimpen",
        variant: "destructive",
      });
    } else {
      router.replace("/admin");
      toast({
        title: "Data Parantos Disimpen",
        description: dataApprove.message,
        variant: "success",
      });
    }
  };

  const handleReject = async () => {
    setLoadingReject(true);
    const res = await fetch(`/api/dongeng/list-ngupingkeun/${id}/reject`, {
      method: "PATCH",
    });

    const dataApprove = await res.json();
    setLoadingReject(false);

    if (!res.ok) {
      toast({
        title: "Data Gagal Disimpen",
        description: dataApprove.error || "Gagal disimpen",
        variant: "destructive",
      });
    } else {
      router.replace("/admin");
      toast({
        title: "Data Parantos Disimpen",
        description: dataApprove.message,
        variant: "success",
      });
    }
  };

  return (
    <div className="flex justify-end items-end gap-2 mt-4">
      <Button disabled={loadingReject} onClick={handleReject}>
        {loadingReject ? "Memproses..." : "Tolak"}
      </Button>
      <Button
        variant="default"
        className="bg-[#fafafa]"
        onClick={handleApprove}
        disabled={loadingApprove}
      >
        {loadingApprove ? "Memproses..." : "Tarima"}
      </Button>
    </div>
  );
}
