"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Dongeng = {
  id: string;
  judul: string;
  status: "pending" | "approved" | "rejected";
};

type Nguping = {
  id: string;
  status: "pending" | "approved" | "rejected";
  dongeng_id: { judul: string };
};

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "approved"
      ? "adm-pill adm-pill-approved"
      : status === "rejected"
      ? "adm-pill adm-pill-rejected"
      : "adm-pill adm-pill-pending";
  const label =
    status === "approved" ? "Ditarima" : status === "rejected" ? "Ditolak" : "Ngantri";
  return <span className={cls}>{label}</span>;
}

export default function AdminPage() {
  const router = useRouter();
  const [dataLokasi, setDataLokasi] = useState<Dongeng[]>([]);
  const [dataNguping, setDataNguping] = useState<Nguping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dongeng").then((r) => r.json()),
      fetch("/api/dongeng/list-nguping").then((r) => r.json()),
    ]).then(([d, n]) => {
      setDataLokasi(d.data || []);
      setDataNguping(n.data || []);
      setLoading(false);
    });
  }, []);

  const pending = dataLokasi.filter((d) => d.status === "pending").length;
  const ngupingPending = dataNguping.filter((d) => d.status === "pending").length;

  return (
    <div className="sb-section paper-bg fade-enter" style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="sb-section-head">
        <div>
          <span className="sb-breadcrumb handwritten">Haus → Admin</span>
          <h2>Dasbor Admin.</h2>
        </div>
        <p>
          Tinjauan sareng moderasi sadaya kiriman dongéng anu parantos diasupkeun ku pamaké.
        </p>
      </div>

      {/* Stats */}
      <div className="sb-stats-bar" style={{ margin: "0 0 40px" }}>
        <div className="sb-stat-item">
          <span className="sb-stat-value">{loading ? "…" : dataLokasi.length}</span>
          <span className="sb-stat-label">Total Dongéng</span>
        </div>
        <div className="sb-stat-item">
          <span className="sb-stat-value" style={{ color: pending > 0 ? "oklch(0.55 0.15 80)" : undefined }}>
            {loading ? "…" : pending}
          </span>
          <span className="sb-stat-label">Dongéng Ngantri</span>
        </div>
        <div className="sb-stat-item">
          <span className="sb-stat-value">{loading ? "…" : dataNguping.length}</span>
          <span className="sb-stat-label">Total Ngupingkeun</span>
        </div>
        <div className="sb-stat-item">
          <span className="sb-stat-value" style={{ color: ngupingPending > 0 ? "oklch(0.55 0.15 80)" : undefined }}>
            {loading ? "…" : ngupingPending}
          </span>
          <span className="sb-stat-label">Nguping Ngantri</span>
        </div>
      </div>

      {/* List Dongeng */}
      <div className="adm-section">
        <div className="adm-section-title">
          Daptar Dongéng
          <span>{dataLokasi.length}</span>
        </div>
        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-empty">
              <span style={{ width: 32, height: 32, border: "3px solid var(--sb-line)", borderTopColor: "var(--terracotta)", borderRadius: "50%", display: "inline-block", animation: "adm-spin 0.8s linear infinite" }} />
            </div>
          ) : dataLokasi.length === 0 ? (
            <div className="adm-empty">Teu acan aya dongéng.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="adm-col-no">#</th>
                  <th>Judul</th>
                  <th className="adm-col-status">Status</th>
                  <th className="adm-col-action">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataLokasi.map((item, i) => (
                  <tr key={item.id}>
                    <td className="adm-col-no">{i + 1}</td>
                    <td className="adm-col-judul">{item.judul}</td>
                    <td className="adm-col-status">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="adm-col-action">
                      <button
                        className="adm-btn-detail"
                        onClick={() => router.push(`/maos/detail/${btoa(item.id)}`)}
                      >
                        Detail
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* List Ngupingkeun */}
      <div className="adm-section">
        <div className="adm-section-title">
          Daptar Ngupingkeun
          <span>{dataNguping.length}</span>
        </div>
        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-empty">
              <span style={{ width: 32, height: 32, border: "3px solid var(--sb-line)", borderTopColor: "var(--terracotta)", borderRadius: "50%", display: "inline-block", animation: "adm-spin 0.8s linear infinite" }} />
            </div>
          ) : dataNguping.length === 0 ? (
            <div className="adm-empty">Teu acan aya data ngupingkeun.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th className="adm-col-no">#</th>
                  <th>Judul</th>
                  <th className="adm-col-status">Status</th>
                  <th className="adm-col-action">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataNguping.map((item, i) => (
                  <tr key={item.id}>
                    <td className="adm-col-no">{i + 1}</td>
                    <td className="adm-col-judul">{item.dongeng_id?.judul}</td>
                    <td className="adm-col-status">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="adm-col-action">
                      <button
                        className="adm-btn-detail"
                        onClick={() => router.push(`/ngupingkeun/${item.id}`)}
                      >
                        Detail
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`@keyframes adm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
