"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { MdPlace } from "react-icons/md";
import {
  IoPlayCircleOutline,
  IoPauseCircleOutline,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5";
import { FaPlus, FaPlay, FaSpinner, FaPause } from "react-icons/fa6";
import { CgPlayListRemove } from "react-icons/cg";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";
import { supabase } from "@/lib/supabase";

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

  // 🔊 Ref untuk audio element global
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getDataMap(), getPlaylist()]);
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

  const getDataMap = async () => {
    const res = await fetch("/api/dongeng");
    const { data } = await res.json();

    // ❗️Filter hanya dongeng dengan kolom audio tidak null
    const filtered = (data || []).filter(
      (d: any) => d.audio !== null && d.status_audio === "approved"
    );
    setDataDongeng(filtered);
  };

  const getPlaylist = async () => {
    const res = await fetch("/api/dongeng/playlist");
    const { data } = await res.json();
    setDataPlaylist(data || []);
    cekPlaylist(data || []);
  };

  const cekPlaylist = (playlistData: any[]) => {
    const ids = playlistData.map((item) =>
      typeof item.dongeng_id === "object" ? item.dongeng_id.id : item.dongeng_id
    );
    setPlaylistIds(ids);
  };

  // ✅ Fungsi Play individual
  const handlePlay = (item: any) => {
    if (!item.audio) return;

    // Jika lagi play dan klik item yang sama → pause
    if (playingId === item.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    // Jika audioRef belum ada → buat baru
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    audioRef.current.src = item.audio;
    audioRef.current.play();
    setPlayingId(item.id);

    incrementHearCount(item.id);

    // Event ketika audio selesai
    audioRef.current.onended = () => setPlayingId(null);
  };

  // ✅ Tambah playlist
  const handleAddToPlaylist = async (item: any) => {
    if (playlistIds.includes(item.id)) return;
    setAddingId(item.id);

    const res = await fetch("/api/dongeng/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dongeng_id: item.id }),
    });

    if (res.ok) await getPlaylist();
    setAddingId(null);
  };

  // ✅ Hapus playlist
  const handleDeletePlaylist = async (id: string) => {
    setDeletingId(id);
    const res = await fetch(`/api/dongeng/playlist/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await getPlaylist();
    setDeletingId(null);
  };

  // ✅ Play seluruh playlist (audio)
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
    const audioUrl = typeof dongengItem === "object" ? dongengItem.audio : null;
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
      const { data: current, error: fetchErr } = await supabase
        .from("dongeng")
        .select("hear")
        .eq("id", id)
        .single();

      if (fetchErr) throw fetchErr;

      const currentHear = current?.hear ?? 0;

      const { error: updateErr } = await supabase
        .from("dongeng")
        .update({ hear: currentHear + 1 })
        .eq("id", id);

      if (updateErr) throw updateErr;
    } catch (err) {
      console.error("❌ Gagal menambah hear count:", err);
    }
  };

  return (
    <div className="flex flex-col items-start lg:flex-row gap-6 px-4 sm:px-6 md:px-10 pt-6 min-h-screen py-10">
      {/* 🔹 Daftar Dongeng */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Ngupingkeun Dongeng
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dataDongeng.map((item: any, index: number) => {
              const alreadyInPlaylist = playlistIds.includes(item.id);
              const isAdding = addingId === item.id;

              return (
                <div
                  key={index}
                  className="flex flex-col bg-white rounded-xl justify-between gap-4 p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  {item.photo ? (
                    <div className="self-center">
                      <Image
                        width={20}
                        height={20}
                        src={item?.photo}
                        alt="photo dongeng"
                        className="rounded-full w-20 h-20"
                      />
                    </div>
                  ) : (
                    <div className="rounded-full bg-gray-400 w-24 h-24 self-center"></div>
                  )}

                  <span className="text-lg font-semibold text-center text-gray-800">
                    {item.judul}
                  </span>

                  <div className="flex gap-2 items-start text-gray-700 text-sm">
                    <MdPlace size={18} />
                    <div className="flex flex-col">
                      <span>Kecamatan: {item.kecamatan}</span>
                      <span>Desa: {item.desa}</span>
                    </div>
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
        )}
      </div>

      {/* 🔹 Playlist */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-[#fafafa] rounded-xl border border-gray-300 shadow-md flex flex-col mt-16 h-fit">
        <div className="p-5 border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold">
            Daptar Dongéng anu badé dikupingkeun
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {dataPlaylist.length > 0 ? (
            dataPlaylist.map((item: any, index: number) => (
              <div
                key={index}
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
                  <FaSpinner size={22} className="text-gray-600 animate-spin" />
                ) : (
                  <CgPlayListRemove
                    size={25}
                    color="red"
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => handleDeletePlaylist(item.id)}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-sm text-center">
              Tambihkeun heula dongeng ka playlist!
            </div>
          )}
        </div>

        {/* 🔹 Tombol Control Playlist */}
        <div className="border-t border-gray-200 p-5 flex justify-around items-center shrink-0">
          <IoPlayBack
            size={30}
            className="cursor-pointer hover:text-gray-700"
            onClick={handleBack}
          />

          {isPlaylistPlaying ? (
            <FaPause
              size={30}
              className="cursor-pointer text-gray-800"
              onClick={handlePlayPlaylist}
            />
          ) : (
            <FaPlay
              size={30}
              className="cursor-pointer text-gray-800"
              onClick={handlePlayPlaylist}
            />
          )}

          <IoPlayForward
            size={30}
            className="cursor-pointer hover:text-gray-700"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default NgupingkeunPage;
