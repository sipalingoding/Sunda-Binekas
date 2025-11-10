"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButtons({
  id,
  isAudio,
}: {
  id: string;
  isAudio: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
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
      toast({
        title: "Data Gagal Disimpen",
        description: dataApprove.error || "Gagal disimpen",
        variant: "destructive",
      });
    } else {
      if (isAudio) {
        setLoadingApprove(true);
        const resAudio = await fetch(`/api/dongeng/${id}/audio`, {
          method: "PATCH",
        });

        const audioApprove = await resAudio.json();
        setLoadingApprove(false);
        if (!resAudio.ok) {
          toast({
            title: "Data Gagal Disimpen",
            description: audioApprove.error || "Gagal disimpen",
            variant: "destructive",
          });
        }
      }
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
    const res = await fetch(`/api/dongeng/${id}/reject`, {
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
      <Button onClick={() => router.push(`/nyerat/form/edit/${id}`)}>
        Edit
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
