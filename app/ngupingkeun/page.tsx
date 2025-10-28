"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { GrView } from "react-icons/gr";
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
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getDataMap(), getPlaylist()]);
      setLoading(false);
    };

    fetchData();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getDataMap = async () => {
    const res = await fetch("/api/dongeng");
    const { data } = await res.json();
    setDataDongeng(data || []);
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
    stopSpeech();
    if (playingId === item.id) {
      setPlayingId(null);
      return;
    }
    playSpeech(item.eusi, () => setPlayingId(null));
    setPlayingId(item.id);
  };

  // ✅ Helper: play speech dengan callback onEnd
  const playSpeech = (text: string, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    speechRef.current = null;
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

  // ✅ Play seluruh playlist
  const handlePlayPlaylist = () => {
    if (dataPlaylist.length === 0) return;

    // Jika sedang playing → pause/resume
    if (isPlaylistPlaying) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setIsPlaylistPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaylistPlaying(true);
      }
      return;
    }

    // Reset dulu
    stopSpeech();
    setCurrentPlaylistIndex(0);
    setIsPlaylistPlaying(true);
    playCurrentDongeng(0);
  };

  const playCurrentDongeng = (index: number) => {
    if (index < 0 || index >= dataPlaylist.length) {
      setIsPlaylistPlaying(false);
      setCurrentPlaylistIndex(0);
      return;
    }

    const dongengItem = dataPlaylist[index].dongeng_id;
    const text =
      typeof dongengItem === "object" ? dongengItem.eusi : "Tidak ada teks.";

    playSpeech(text, () => {
      const nextIndex = index + 1;
      if (nextIndex < dataPlaylist.length) {
        setCurrentPlaylistIndex(nextIndex);
        playCurrentDongeng(nextIndex);
      } else {
        setIsPlaylistPlaying(false);
        setCurrentPlaylistIndex(0);
      }
    });
  };

  // ✅ Tombol next / back
  const handleNext = () => {
    const nextIndex = currentPlaylistIndex + 1;
    if (nextIndex < dataPlaylist.length) {
      stopSpeech();
      setCurrentPlaylistIndex(nextIndex);
      playCurrentDongeng(nextIndex);
      setIsPlaylistPlaying(true);
    }
  };

  const handleBack = () => {
    const prevIndex = currentPlaylistIndex - 1;
    if (prevIndex >= 0) {
      stopSpeech();
      setCurrentPlaylistIndex(prevIndex);
      playCurrentDongeng(prevIndex);
      setIsPlaylistPlaying(true);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-white rounded-xl gap-4 p-5 shadow-md border border-gray-200"
              >
                <div className="rounded-full bg-gray-300 w-20 h-20 self-center"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
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

                  <span className="text-sm text-gray-600 line-clamp-4 text-justify">
                    {item.eusi}
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
                      <GrView />
                      <span>{item.view}</span>
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
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-200 pb-2 animate-pulse"
              >
                <div className="flex gap-2 items-center">
                  <div className="rounded-full w-8 h-8 bg-gray-300"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : dataPlaylist.length > 0 ? (
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
