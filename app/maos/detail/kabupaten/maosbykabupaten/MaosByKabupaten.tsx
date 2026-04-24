"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MaosByKabupatenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kabupaten = searchParams?.get("kabupaten") ?? "";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedDongengKecamatan, setSelectedDongengKecamatan] = useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");
  const [dongengList, setDongengList] = useState<any[]>([]);
  const [searchKecamatan, setSearchKecamatan] = useState("");
  const [searchDesa, setSearchDesa] = useState("");
  const [loadingDongeng, setLoadingDongeng] = useState(false);

  useEffect(() => {
    if (!kabupaten) return;
    setLoading(true);
    fetch(`/api/dongeng/by-kabupaten?kabupaten=${encodeURIComponent(kabupaten)}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data || []);
        setDongengList(json.data || []);
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [kabupaten]);

  useEffect(() => {
    if (!data[0]?.kabupaten) return;
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((res) => res.json())
      .then((kabupatenList) => {
        const found = kabupatenList.find((item: any) =>
          item.name
            .toLowerCase()
            .includes(data[0].kabupaten.replace("KABUPATEN ", "").toLowerCase())
        );
        if (found) {
          fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${found.id}.json`)
            .then((res) => res.json())
            .then((result) => setKecamatanList(result))
            .catch((err) => console.error("Gagal ambil kecamatan:", err));
        }
      })
      .catch((err) => console.error("Gagal ambil kabupaten:", err));
  }, [data]);

  useEffect(() => {
    if (!selectedKecamatan) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKecamatan}.json`)
      .then((res) => res.json())
      .then((data) => setDesaList(data))
      .catch((err) => console.error("Gagal ambil desa:", err));
  }, [selectedKecamatan]);

  const handleSearchDongeng = async () => {
    setLoadingDongeng(true);
    try {
      const res = await fetch("/api/dongeng/by-wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kecamatan: selectedDongengKecamatan, desa: selectedDesa }),
      });
      const json = await res.json();
      setDongengList(json.data || []);
    } catch (err) {
      console.error("Gagal memuat dongeng:", err);
    } finally {
      setLoadingDongeng(false);
    }
  };

  const handleMaca = (id: string) => {
    setLoadingItem(id);
    router.push(`/maos/detail/${btoa(id)}`);
  };

  if (!kabupaten) {
    return <div className="sb-section paper-bg">Kabupaten tidak ditentukan.</div>;
  }

  const filteredKecamatanList = kecamatanList.filter((item) =>
    item.name.toLowerCase().includes(searchKecamatan.toLowerCase())
  );
  const filteredDesaList = desaList.filter((item) =>
    item.name.toLowerCase().includes(searchDesa.toLowerCase())
  );

  return (
    <div className="sb-section paper-bg fade-enter">
      {/* Back */}
      <button className="nd-back" onClick={() => router.back()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Balik ka peta
      </button>

      {/* Header */}
      <div className="sb-section-head" style={{ marginTop: 24 }}>
        <div>
          <span className="sb-breadcrumb handwritten">Maos → {kabupaten}</span>
          <h2>Dongéng di {kabupaten}.</h2>
        </div>
        <p>
          {loading ? (
            <span style={{ opacity: 0.5 }}>Nuju ngamuat…</span>
          ) : (
            <>
              <strong>{dongengList.length}</strong> dongéng kapendak. Saring dumasar kecamatan atanapi desa pikeun ngahususkeun pilarian.
            </>
          )}
        </p>
      </div>

      {error && (
        <div style={{ color: "var(--terracotta)", fontSize: 14, marginBottom: 16 }}>{error}</div>
      )}

      {/* Filter bar */}
      <div className="sb-form-section" style={{ marginBottom: 40 }}>
        <div className="sb-form-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          Saring Wilayah
        </div>
        <div className="kab-filter-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
          {/* Kecamatan */}
          <div>
            <label className="sb-form-label">Kecamatan</label>
            <Select
              onValueChange={(value) => {
                const selected = kecamatanList.find((k) => k.name === value);
                if (selected) {
                  setSelectedKecamatan(selected.id);
                  setSelectedDongengKecamatan(selected.name);
                }
              }}
            >
              <SelectTrigger className="sb-form-select">
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent className="sb-form-select-content">
                <Input
                  placeholder="Cari Kecamatan…"
                  value={searchKecamatan}
                  onChange={(e) => setSearchKecamatan(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                {filteredKecamatanList.length > 0 ? (
                  filteredKecamatanList.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <div style={{ padding: "8px 12px", fontSize: 13, color: "var(--sb-muted)" }}>
                    Teu kapendak
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Desa */}
          <div>
            <label className="sb-form-label">Desa <span style={{ color: "var(--sb-muted)", fontWeight: 400 }}>(Opsional)</span></label>
            <Select
              onValueChange={(value) => {
                const selected = desaList.find((k) => k.name === value);
                if (selected) setSelectedDesa(selected.name);
              }}
            >
              <SelectTrigger className="sb-form-select">
                <SelectValue placeholder="Pilih Desa" />
              </SelectTrigger>
              <SelectContent className="sb-form-select-content">
                <Input
                  placeholder="Cari Desa…"
                  value={searchDesa}
                  onChange={(e) => setSearchDesa(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                {filteredDesaList.length > 0 ? (
                  filteredDesaList.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <div style={{ padding: "8px 12px", fontSize: 13, color: "var(--sb-muted)" }}>
                    {selectedKecamatan ? "Teu kapendak" : "Pilih kecamatan heula"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tombol */}
          <button
            className="btn-sb-primary"
            onClick={handleSearchDongeng}
            disabled={loadingDongeng}
            style={{ height: 42, paddingInline: 20, fontSize: 14 }}
          >
            {loadingDongeng ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Teangan…
              </>
            ) : (
              <>
                Teangan
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="sb-dcard sb-dcard-skeleton">
              <div className="sb-dcard-img" />
              <div className="sb-dcard-body">
                <div className="sb-dcard-loading" style={{ height: 14, marginBottom: 8 }} />
                <div className="sb-dcard-loading" style={{ height: 10, width: "60%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : dongengList.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {dongengList.map((item, index) => (
            <div key={index} className="sb-dcard">
              <div className="sb-dcard-img">
                {item?.photo ? (
                  <Image
                    src={item.photo}
                    alt={item.judul}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--sb-muted)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="sb-dcard-body">
                {item.kecamatan && (
                  <div className="sb-dcard-meta">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: 3 }}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.kecamatan}{item.desa ? ` · ${item.desa}` : ""}
                  </div>
                )}
                <div className="sb-dcard-title">{item.judul}</div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--sb-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {item.view ?? 0}
                  </span>

                  <button
                    className="sb-dcard-link"
                    onClick={() => handleMaca(item.id)}
                    disabled={loadingItem === item.id}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {loadingItem === item.id ? (
                      "Muka…"
                    ) : (
                      <>
                        Maos
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "64px 24px",
          color: "var(--sb-muted)",
          background: "var(--sb-card)",
          border: "1px solid var(--sb-line)",
          borderRadius: 20,
        }}>
          <div style={{ fontFamily: "var(--font-caveat)", fontSize: 22, marginBottom: 8, color: "var(--terracotta)" }}>
            Teu acan aya dongéng
          </div>
          <div style={{ fontSize: 14 }}>
            Teu acan aya dongéng nu kadaptar di wewengkon ieu.
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .kab-filter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
