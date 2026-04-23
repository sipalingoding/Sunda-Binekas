"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButtons({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    const res = await fetch(`/api/dongeng/${id}`, { method: "PATCH" });
    const dataApprove = await res.json();
    setLoadingApprove(false);
    if (!res.ok) {
      toast({ title: "Data Gagal Disimpen", description: dataApprove.error || "Gagal disimpen", variant: "destructive" });
    } else {
      router.replace("/admin");
      toast({ title: "Data Parantos Disimpen", description: dataApprove.message, variant: "success" });
    }
  };

  const handleReject = async () => {
    setLoadingReject(true);
    const res = await fetch(`/api/dongeng/${id}/reject`, { method: "PATCH" });
    const dataApprove = await res.json();
    setLoadingReject(false);
    if (!res.ok) {
      toast({ title: "Data Gagal Disimpen", description: dataApprove.error || "Gagal disimpen", variant: "destructive" });
    } else {
      router.replace("/admin");
      toast({ title: "Data Parantos Disimpen", description: dataApprove.message, variant: "success" });
    }
  };

  return (
    <div className="md-admin">
      <button className="md-admin-btn md-admin-btn-danger" disabled={loadingReject} onClick={handleReject}>
        {loadingReject ? (
          <span style={{ width: 13, height: 13, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        )}
        Tolak
      </button>

      <button className="md-admin-btn" onClick={() => router.push(`/nyerat/form/edit/${id}`)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>

      <button className="md-admin-btn md-admin-btn-approve" onClick={handleApprove} disabled={loadingApprove}>
        {loadingApprove ? (
          <span style={{ width: 13, height: 13, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
        Tarima
      </button>
      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
