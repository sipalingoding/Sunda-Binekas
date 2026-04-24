"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButtonsNgupingkeun({ id }: { id: string }) {
  const router = useRouter();
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const handleApprove = async () => {
    setLoadingApprove(true);
    const res = await fetch(`/api/dongeng/list-nguping/${id}`, { method: "PATCH" });
    const body = await res.json();
    setLoadingApprove(false);
    if (res.ok) router.replace("/admin");
  };

  const handleReject = async () => {
    setLoadingReject(true);
    const res = await fetch(`/api/dongeng/list-nguping/${id}/reject`, { method: "PATCH" });
    const body = await res.json();
    setLoadingReject(false);
    if (res.ok) router.replace("/admin");
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
      <style>{`@keyframes lf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
