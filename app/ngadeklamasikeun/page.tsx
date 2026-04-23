"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NgadeklamasikeunPage = () => {
  const router = useRouter();
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");
  const [loadingFilter, setLoadingFilter] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await getDataDongeng();
      setLoading(false);
    };
    init();
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const getDataDongeng = async () => {
    const res = await fetch("/api/dongeng");
    const { data } = await res.json();
    setDataDongeng((data || []).filter((item: any) => item.status_audio !== "approved"));
  };

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((r) => r.json()).then(setKabupatenList).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedKabupaten) { setKecamatanList([]); setDesaList([]); setSelectedKecamatan(""); setSelectedDesa(""); return; }
    const kab = kabupatenList.find((k) => k.name === selectedKabupaten);
    if (!kab) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kab.id}.json`)
      .then((r) => r.json()).then((d) => { setKecamatanList(d); setDesaList([]); setSelectedKecamatan(""); setSelectedDesa(""); }).catch(console.error);
  }, [selectedKabupaten]);

  useEffect(() => {
    if (!selectedKecamatan) { setDesaList([]); setSelectedDesa(""); return; }
    const kec = kecamatanList.find((k) => k.name === selectedKecamatan);
    if (!kec) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kec.id}.json`)
      .then((r) => r.json()).then((d) => { setDesaList(d); setSelectedDesa(""); }).catch(console.error);
  }, [selectedKecamatan]);

  const handleFilter = async () => {
    setLoadingFilter(true);
    try {
      const res = await fetch("/api/dongeng/filter-ngupingkeun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kabupaten: selectedKabupaten || null, kecamatan: selectedKecamatan || null, desa: selectedDesa || null }),
      });
      const { data } = await res.json();
      setDataDongeng(data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingFilter(false); }
  };

  const handleReset = async () => {
    setSelectedKabupaten(""); setSelectedKecamatan(""); setSelectedDesa("");
    setLoading(true);
    await getDataDongeng();
    setLoading(false);
  };

  const handlePilih = (id: string) => {
    setLoadingItem(id);
    router.replace(`/ngadeklamasikeun/detail/${btoa(id)}`);
  };

  return (
    <div className="ng-page">
      <div className="ng-inner">
        {/* Header */}
        <div className="ng-head">
          <span className="ng-eyebrow">Ngadeklamasikeun</span>
          <h1 className="ng-title">Rekam Sora Anjeun</h1>
          <p className="ng-sub">Piliheun dongéng anu badé di déklam, lajeng rekam sora anjeun maca éta dongéng.</p>
        </div>

        {/* Filter */}
        <div className="ng-filter">
          <select value={selectedKabupaten} onChange={(e) => setSelectedKabupaten(e.target.value)}>
            <option value="">Sadaya Kabupaten</option>
            {kabupatenList.map((k) => <option key={k.id} value={k.name}>{k.name}</option>)}
          </select>

          <select value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)} disabled={!selectedKabupaten}>
            <option value="">Sadaya Kecamatan</option>
            {kecamatanList.map((k) => <option key={k.id} value={k.name}>{k.name}</option>)}
          </select>

          <select value={selectedDesa} onChange={(e) => setSelectedDesa(e.target.value)} disabled={!selectedKecamatan}>
            <option value="">Sadaya Desa</option>
            {desaList.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          <button className="ng-filter-btn" onClick={handleFilter} disabled={loadingFilter || loading}>
            {loadingFilter ? (
              <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            )}
            Teangan
          </button>

          {(selectedKabupaten || selectedKecamatan || selectedDesa) && (
            <button className="ng-filter-reset" onClick={handleReset}>Hapus filter</button>
          )}
        </div>

        {/* Grid */}
        <div className="ng-grid">
          {loading ? (
            <div className="ng-spinner">
              <span style={{ width: 40, height: 40, border: "3px solid var(--sb-line)", borderTopColor: "var(--terracotta)", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
            </div>
          ) : dataDongeng.length === 0 ? (
            <div className="ng-empty">
              <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🎙️</span>
              Teu acan aya dongéng anu tiasa di déklam
            </div>
          ) : dataDongeng.map((item: any) => (
            <div key={item.id} className="ng-card">
              {item.photo ? (
                <Image src={item.photo} alt={item.judul} width={400} height={225} className="ng-card-thumb" />
              ) : (
                <div className="ng-card-thumb-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
              )}

              <div className="ng-card-body">
                <div className="ng-card-title">{item.judul}</div>

                <div className="ng-card-loc">
                  <span>{item.kecamatan}</span>
                  <span>{item.desa}</span>
                </div>

                <div className="ng-card-footer">
                  <div className="ng-card-hear">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {item.view ?? 0}
                  </div>

                  <button
                    className="ng-btn-play"
                    onClick={() => handlePilih(item.id)}
                    disabled={loadingItem === item.id}
                  >
                    {loadingItem === item.id ? (
                      <span style={{ width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                      </svg>
                    )}
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default NgadeklamasikeunPage;
