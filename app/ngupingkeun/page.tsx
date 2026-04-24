"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const NgupingkeunPage = () => {
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [dataPlaylist, setDataPlaylist] = useState<any[]>([]);
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);

  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([getDataDongeng(), getPlaylist()]);
      setLoading(false);
    };
    init();
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    };
  }, []);

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

  const getDataDongeng = async () => {
    const res = await fetch("/api/dongeng/list-nguping");
    const { data } = await res.json();
    setDataDongeng((data || []).filter((d: any) => d.status === "approved"));
  };

  const getPlaylist = async () => {
    const res = await fetch("/api/dongeng/playlist");
    const { data } = await res.json();
    setDataPlaylist(data || []);
    setPlaylistIds((data || []).map((i: any) => typeof i.dongeng_id === "object" ? i.dongeng_id.id : i.dongeng_id));
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dongeng/filter-ngupingkeun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kabupaten: selectedKabupaten || null, kecamatan: selectedKecamatan || null, desa: selectedDesa || null }),
      });
      const { data } = await res.json();
      setDataDongeng((data || []).filter((d: any) => d.status === "approved"));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    setSelectedKabupaten(""); setSelectedKecamatan(""); setSelectedDesa("");
    setLoading(true);
    await getDataDongeng();
    setLoading(false);
  };

  const incrementHearCount = async (id: string) => {
    try {
      const { data: cur } = await supabase.from("ngupingkeun_list").select("hear").eq("id", id).single();
      await supabase.from("ngupingkeun_list").update({ hear: (cur?.hear ?? 0) + 1 }).eq("id", id);
    } catch { /* silent */ }
  };

  const handlePlay = (item: any) => {
    if (!item.file_audio) return;
    if (playingId === item.id) { audioRef.current?.pause(); setPlayingId(null); return; }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = item.file_audio;
    audioRef.current.play();
    setPlayingId(item.id);
    incrementHearCount(item.id);
    audioRef.current.onended = () => setPlayingId(null);
  };

  const handleAddToPlaylist = async (item: any) => {
    if (playlistIds.includes(item.id)) return;
    setAddingId(item.id);
    const res = await fetch("/api/dongeng/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dongeng_id: item.dongeng_id.id }),
    });
    if (res.ok) await getPlaylist();
    setAddingId(null);
  };

  const handleDeletePlaylist = async (id: string) => {
    setDeletingId(id);
    const res = await fetch(`/api/dongeng/playlist/${id}`, { method: "DELETE" });
    if (res.ok) await getPlaylist();
    setDeletingId(null);
  };

  const playCurrentDongeng = (index: number) => {
    if (!audioRef.current || index >= dataPlaylist.length) { setIsPlaylistPlaying(false); return; }
    const dongengItem = dataPlaylist[index].dongeng_id;
    const audioUrl = typeof dongengItem === "object" ? dongengItem.file_audio : null;
    if (!audioUrl) return;
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    incrementHearCount(typeof dongengItem === "object" ? dongengItem.id : dongengItem);
    audioRef.current.onended = () => {
      const next = index + 1;
      if (next < dataPlaylist.length) { setCurrentPlaylistIndex(next); playCurrentDongeng(next); }
      else { setIsPlaylistPlaying(false); setCurrentPlaylistIndex(0); }
    };
  };

  const handlePlayPlaylist = () => {
    if (dataPlaylist.length === 0) return;
    if (!audioRef.current) audioRef.current = new Audio();
    if (isPlaylistPlaying) { audioRef.current.pause(); setIsPlaylistPlaying(false); return; }
    setCurrentPlaylistIndex(0);
    setIsPlaylistPlaying(true);
    playCurrentDongeng(0);
  };

  const handleNext = () => {
    const next = currentPlaylistIndex + 1;
    if (next < dataPlaylist.length) { setCurrentPlaylistIndex(next); playCurrentDongeng(next); }
  };

  const handleBack = () => {
    const prev = currentPlaylistIndex - 1;
    if (prev >= 0) { setCurrentPlaylistIndex(prev); playCurrentDongeng(prev); }
  };

  return (
    <div className="ng-page">
      <div className="ng-inner">
        {/* Header */}
        <div className="ng-head">
          <span className="ng-eyebrow">Ngupingkeun</span>
          <h1 className="ng-title">Dongéng pikeun di Upingkeun</h1>
          <p className="ng-sub">Piliheun dongéng anu badé di kupingkeun, tambihkeun kana daptar putar, teras nikmatan.</p>
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

          <button className="ng-filter-btn" onClick={handleFilter} disabled={loading}>
            {loading ? (
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

        {/* Body */}
        <div className="ng-body">
          {/* Dongeng grid */}
          <div className="ng-grid">
            {loading ? (
              <div className="ng-spinner">
                <span style={{ width: 40, height: 40, border: "3px solid var(--sb-line)", borderTopColor: "var(--terracotta)", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
              </div>
            ) : dataDongeng.length === 0 ? (
              <div className="ng-empty">
                <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🎙️</span>
                Teu acan aya dongeng anu tiasa di kupingkeun
              </div>
            ) : dataDongeng.map((item: any) => {
              const inPlaylist = playlistIds.includes(item.id);
              const isAdding = addingId === item.id;
              const isPlaying = playingId === item.id;
              return (
                <div key={item.id} className="ng-card">
                  {/* Thumbnail */}
                  <div className="ng-card-thumb">
                    {item.dongeng_id?.photo ? (
                      <Image
                        src={item.dongeng_id.photo}
                        alt={item.dongeng_id.judul}
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="ng-card-thumb-placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="ng-card-body">
                    <div className="ng-card-title">{item.dongeng_id?.judul}</div>

                    <div className="ng-card-loc">
                      {item.dongeng_id?.kecamatan && <span>{item.dongeng_id.kecamatan}</span>}
                      {item.dongeng_id?.desa && <span>{item.dongeng_id.desa}</span>}
                    </div>

                    <div className="ng-card-contrib">
                      {item.user_id?.photo ? (
                        <Image
                          src={item.user_id.photo}
                          alt={item.user_id.username}
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="ng-card-contrib-placeholder">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      )}
                      <span>{item.user_id?.username}</span>
                    </div>

                    <div className="ng-card-footer">
                      <div className="ng-card-hear">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                        </svg>
                        {item.hear ?? 0}
                      </div>

                      <div className="ng-card-actions">
                        <button className="ng-btn-play" onClick={() => handlePlay(item)} title={isPlaying ? "Jeda" : "Putar"}>
                          {isPlaying ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                          )}
                        </button>

                        <button
                          className={`ng-btn-playlist${inPlaylist ? " added" : ""}`}
                          onClick={() => handleAddToPlaylist(item)}
                          disabled={inPlaylist || isAdding}
                          title={inPlaylist ? "Parantos aya dina playlist" : "Tambih ka playlist"}
                        >
                          {inPlaylist ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7" /></svg>
                          ) : isAdding ? (
                            <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite" }} />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playlist */}
          <aside className="ng-playlist">
            <div className="ng-playlist-head">
              <span className="ng-playlist-label">Daptar Putar</span>
              <div className="ng-playlist-title">Playlist Anjeun</div>
            </div>

            <div className="ng-playlist-list">
              {dataPlaylist.length === 0 ? (
                <div className="ng-playlist-empty">
                  Acan aya dongeng dina playlist
                </div>
              ) : dataPlaylist.map((item: any, index: number) => {
                const dongeng = item.dongeng_id;
                const title = typeof dongeng === "object" ? dongeng?.judul : dongeng;
                const photo = typeof dongeng === "object" ? dongeng?.photo : null;
                const isActive = index === currentPlaylistIndex && isPlaylistPlaying;
                return (
                  <div key={item.id} className={`ng-playlist-item${isActive ? " playing" : ""}`}>
                    {photo ? (
                      <Image src={photo} alt={title} width={32} height={32} className="ng-playlist-item-photo" />
                    ) : (
                      <div className="ng-playlist-item-photo-ph" />
                    )}
                    <span className="ng-playlist-item-title">{title}</span>
                    {deletingId === item.id ? (
                      <span style={{ width: 14, height: 14, border: "2px solid var(--sb-muted)", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "lf-spin 0.8s linear infinite", flexShrink: 0 }} />
                    ) : (
                      <button className="ng-playlist-remove" onClick={() => handleDeletePlaylist(item.id)} title="Hapus">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="ng-playlist-controls">
              <button className="ng-ctrl-btn" onClick={handleBack} disabled={dataPlaylist.length === 0 || currentPlaylistIndex === 0} title="Sebelumna">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="19,20 9,12 19,4" /><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              </button>

              <button className="ng-ctrl-play" onClick={handlePlayPlaylist} disabled={dataPlaylist.length === 0} title={isPlaylistPlaying ? "Jeda" : "Putar playlist"}>
                {isPlaylistPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                )}
              </button>

              <button className="ng-ctrl-btn" onClick={handleNext} disabled={dataPlaylist.length === 0 || currentPlaylistIndex >= dataPlaylist.length - 1} title="Salajengna">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,4 15,12 5,20" /><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              </button>
            </div>
          </aside>
        </div>
      </div>
      <style>{`@keyframes lf-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default NgupingkeunPage;
