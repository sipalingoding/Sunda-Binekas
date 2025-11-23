"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { MdPlace, MdHeadsetMic } from "react-icons/md";
import {
  IoPlayCircleOutline,
  IoPauseCircleOutline,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";
import { FaPlus, FaPlay, FaSpinner, FaPause } from "react-icons/fa6";
import { CgPlayListRemove } from "react-icons/cg";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FaCheckCircle } from "react-icons/fa";

const NgupingkeunPage = () => {
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [dataPlaylist, setDataPlaylist] = useState<any[]>([]);
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number>(0);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);

  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");

  const [searchKab, setSearchKab] = useState("");
  const [searchKec, setSearchKec] = useState("");
  const [searchDesa, setSearchDesa] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // === 🔹 Initial Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getDataDongeng(), getPlaylist()]);
      setLoading(false);
    };
    fetchData();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const getDataDongeng = async () => {
    const res = await fetch("/api/dongeng/list-nguping");
    const { data } = await res.json();
    const filtered = (data || []).filter((d: any) => d.status === "approved");
    setDataDongeng(filtered);
  };

  const getPlaylist = async () => {
    const res = await fetch("/api/dongeng/playlist");
    const { data } = await res.json();
    setDataPlaylist(data || []);
    setPlaylistIds(
      (data || []).map((i: any) =>
        typeof i.dongeng_id === "object" ? i.dongeng_id.id : i.dongeng_id
      )
    );
  };

  // === 🔹 Fetch Wilayah
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((res) => res.json())
      .then(setKabupatenList)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedKabupaten) {
      setKecamatanList([]);
      setDesaList([]);
      setSelectedKecamatan("");
      setSelectedDesa("");
      return;
    }

    const kab = kabupatenList.find((k) => k.name === selectedKabupaten);
    if (!kab) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kab.id}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setKecamatanList(data);
        setDesaList([]);
        setSelectedKecamatan("");
        setSelectedDesa("");
      })
      .catch(console.error);
  }, [selectedKabupaten]);

  useEffect(() => {
    if (!selectedKecamatan) {
      setDesaList([]);
      setSelectedDesa("");
      return;
    }

    const kec = kecamatanList.find((k) => k.name === selectedKecamatan);
    if (!kec) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kec.id}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setDesaList(data);
        setSelectedDesa("");
      })
      .catch(console.error);
  }, [selectedKecamatan]);

  // === 🔹 Filter Dongeng Berdasarkan Wilayah
  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dongeng/filter-ngupingkeun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kabupaten: selectedKabupaten || null,
          kecamatan: selectedKecamatan || null,
          desa: selectedDesa || null,
        }),
      });
      const { data } = await res.json();
      const filtered = (data || []).filter((d: any) => d.status === "approved");
      setDataDongeng(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === 🔹 Audio Controls
  const handlePlay = (item: any) => {
    console.log(item);
    if (!item.file_audio) return;

    console.log(playingId);
    console.log(item);

    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

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
    const res = await fetch(`/api/dongeng/playlist/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await getPlaylist();
    setDeletingId(null);
  };

  const handlePlayPlaylist = () => {
    if (dataPlaylist.length === 0) return;
    if (!audioRef.current) audioRef.current = new Audio();

    if (isPlaylistPlaying) {
      audioRef.current.pause();
      setIsPlaylistPlaying(false);
      return;
    }

    setCurrentPlaylistIndex(0);
    setIsPlaylistPlaying(true);
    playCurrentDongeng(0);
  };

  const playCurrentDongeng = (index: number) => {
    if (!audioRef.current || index >= dataPlaylist.length) {
      setIsPlaylistPlaying(false);
      return;
    }
    const dongengItem = dataPlaylist[index].dongeng_id;
    const audioUrl =
      typeof dongengItem === "object" ? dongengItem.file_audio : null;
    if (!audioUrl) return;

    audioRef.current.src = audioUrl;
    audioRef.current.play();

    incrementHearCount(
      typeof dongengItem === "object" ? dongengItem.id : dongengItem
    );

    audioRef.current.onended = () => {
      const nextIndex = index + 1;
      if (nextIndex < dataPlaylist.length) {
        setCurrentPlaylistIndex(nextIndex);
        playCurrentDongeng(nextIndex);
      } else {
        setIsPlaylistPlaying(false);
        setCurrentPlaylistIndex(0);
      }
    };
  };

  const handleNext = () => {
    const nextIndex = currentPlaylistIndex + 1;
    if (nextIndex < dataPlaylist.length) {
      setCurrentPlaylistIndex(nextIndex);
      playCurrentDongeng(nextIndex);
    }
  };

  const handleBack = () => {
    const prevIndex = currentPlaylistIndex - 1;
    if (prevIndex >= 0) {
      setCurrentPlaylistIndex(prevIndex);
      playCurrentDongeng(prevIndex);
    }
  };

  const incrementHearCount = async (id: string) => {
    try {
      const { data: current } = await supabase
        .from("ngupingkeun_list")
        .select("hear")
        .eq("id", id)
        .single();
      const currentHear = current?.hear ?? 0;
      await supabase
        .from("ngupingkeun_list")
        .update({ hear: currentHear + 1 })
        .eq("id", id);
    } catch (err) {
      console.error("❌ Gagal menambah hear count:", err);
    }
  };

  // === 🔹 Filtered list dropdown
  const filteredKabupaten = kabupatenList.filter((k) =>
    k.name.toLowerCase().includes(searchKab.toLowerCase())
  );
  const filteredKecamatan = kecamatanList.filter((k) =>
    k.name.toLowerCase().includes(searchKec.toLowerCase())
  );
  const filteredDesa = desaList.filter((d) =>
    d.name.toLowerCase().includes(searchDesa.toLowerCase())
  );

  return (
    <div
      className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 md:px-10 pt-6 min-h-screen py-10 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bghome.png')" }}
    >
      {/* 🔹 Daftar Dongeng */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Ngupingkeun Dongeng
        </h1>

        {/* 🔹 Filter Wilayah */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <Select
            onValueChange={setSelectedKabupaten}
            value={selectedKabupaten}
          >
            <SelectTrigger className="w-full lg:w-[200px] bg-white">
              <SelectValue placeholder="Pilih Kabupaten" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200">
              <Input
                placeholder="Cari Kabupaten..."
                value={searchKab}
                onChange={(e) => setSearchKab(e.target.value)}
                className="mb-2 h-8 text-sm bg-white"
              />
              {filteredKabupaten.length > 0 ? (
                filteredKabupaten.map((kab) => (
                  <SelectItem key={kab.id} value={kab.name}>
                    {kab.name}
                  </SelectItem>
                ))
              ) : (
                <div className="text-xs text-gray-500 text-center py-2">
                  Henteu kapanggih kabupaten
                </div>
              )}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setSelectedKecamatan(v)}
            disabled={!selectedKabupaten}
            value={selectedKecamatan}
          >
            <SelectTrigger className="w-full lg:w-[200px] bg-white">
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200">
              <Input
                placeholder="Cari Kecamatan..."
                value={searchKec}
                onChange={(e) => setSearchKec(e.target.value)}
                className="mb-2 h-8 text-sm"
              />
              {filteredKecamatan.map((k) => (
                <SelectItem key={k.id} value={k.name}>
                  {k.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setSelectedDesa(v)}
            disabled={!selectedKecamatan}
            value={selectedDesa}
          >
            <SelectTrigger className="w-full lg:w-[200px] bg-white">
              <SelectValue placeholder="Pilih Desa" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200">
              <Input
                placeholder="Cari Desa..."
                value={searchDesa}
                onChange={(e) => setSearchDesa(e.target.value)}
                className="mb-2 h-8 text-sm"
              />
              {filteredDesa.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleFilter}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            Teangan
          </Button>
        </div>

        {/* 🔹 Daftar Dongeng */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : dataDongeng.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {dataDongeng.map((item: any) => {
              const alreadyInPlaylist = playlistIds.includes(item.id);
              const isAdding = addingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex flex-col bg-white rounded-xl justify-between gap-4 p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  {item.dongeng_id.photo ? (
                    <Image
                      width={20}
                      height={20}
                      src={item.dongeng_id.photo}
                      alt="photo dongeng"
                      className="rounded-full w-20 h-20 self-center"
                    />
                  ) : (
                    <div className="rounded-full bg-gray-400 w-24 h-24 self-center"></div>
                  )}
                  <span className="text-lg font-semibold text-center text-gray-800">
                    {item.dongeng_id.judul}
                  </span>
                  <div className="flex gap-2 items-start text-gray-700 text-sm">
                    <MdPlace size={18} />
                    <div className="flex flex-col">
                      <span>Kecamatan: {item.dongeng_id.kecamatan}</span>
                      <span>Desa: {item.dongeng_id.desa}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center text-gray-700 text-sm">
                    <Image
                      src={item.user_id.photo}
                      width={30}
                      height={30}
                      alt="profile"
                      className="rounded-full object-cover w-8 h-8"
                    />
                    <span>Versi : {item.user_id.username}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2 items-center text-gray-700 text-sm">
                      <MdHeadsetMic />
                      <span>{item.hear}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"
                        onClick={() => handlePlay(item)}
                      >
                        {playingId === item.id ? (
                          <IoPauseCircleOutline size={36} />
                        ) : (
                          <IoPlayCircleOutline size={36} />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        disabled={alreadyInPlaylist || isAdding}
                        onClick={() => handleAddToPlaylist(item)}
                        className={`p-2 rounded-full text-white flex items-center justify-center ${
                          alreadyInPlaylist
                            ? "bg-green-500 cursor-not-allowed"
                            : isAdding
                            ? "bg-gray-400 cursor-wait"
                            : "bg-gray-500 hover:bg-gray-600"
                        }`}
                      >
                        {alreadyInPlaylist ? (
                          <FaCheckCircle size={32} />
                        ) : isAdding ? (
                          <FaSpinner size={28} className="animate-spin" />
                        ) : (
                          <FaPlus size={32} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            Teu acan aya dongeng anu tiasa di kupingkeun
          </p>
        )}
      </div>

      {/* 🔹 Playlist Sidebar */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-[#fafafa] rounded-xl border border-gray-300 shadow-md flex flex-col mt-6 lg:mt-16 h-fit">
        <div className="p-5 border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold">
            Daptar Dongéng anu badé dikupingkeun
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[400px]">
          {dataPlaylist.length > 0 ? (
            dataPlaylist.map((item: any, index: number) => (
              <div
                key={item.id}
                className={`flex justify-between items-center border-b border-gray-200 pb-2 ${
                  index === currentPlaylistIndex && isPlaylistPlaying
                    ? "bg-green-100 rounded-md px-2"
                    : ""
                }`}
              >
                <div className="flex gap-2 items-center">
                  {item?.dongeng_id?.photo ? (
                    <Image
                      width={8}
                      height={8}
                      src={item?.dongeng_id?.photo}
                      alt="photo dongeng"
                      className="rounded-full w-8 h-8"
                    />
                  ) : (
                    <div className="rounded-full w-8 h-8 bg-gray-500"></div>
                  )}
                  <span className="text-gray-800 text-sm">
                    {typeof item.dongeng_id === "object"
                      ? item.dongeng_id.judul
                      : item.dongeng_id}
                  </span>
                </div>
                {deletingId === item.id ? (
                  <FaSpinner className="animate-spin text-gray-400" />
                ) : (
                  <CgPlayListRemove
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    size={20}
                    onClick={() => handleDeletePlaylist(item.id)}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">
              Teu acan aya dongeng dina daptar putar
            </p>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-4">
          <IoPlayBack
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            size={30}
          />
          <Button
            onClick={handlePlayPlaylist}
            disabled={dataPlaylist.length === 0}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 flex items-center gap-2"
          >
            {isPlaylistPlaying ? (
              <>
                <FaPause />
              </>
            ) : (
              <>
                <FaPlay />
              </>
            )}
          </Button>
          <IoPlayForward
            onClick={handleNext}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            size={30}
          />
        </div>
      </div>
    </div>
  );
};

export default NgupingkeunPage;
