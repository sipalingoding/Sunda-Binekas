"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { GrView } from "react-icons/gr";
import { MdPlace } from "react-icons/md";
import { IoPlayCircleOutline, IoPauseCircleOutline } from "react-icons/io5";
import { FaPlus, FaPlay } from "react-icons/fa6";
import { CgPlayListRemove } from "react-icons/cg";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

const NgupingkeunPage = () => {
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [dataPlaylist, setDataPlaylist] = useState<any[]>([]);
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    getDataMap();
    getPlaylist();
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

  const handlePlay = (item: any) => {
    if (playingId === item.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(item.eusi);
    utterance.lang = "id-ID";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setPlayingId(null);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayingId(item.id);
  };

  const handleAddToPlaylist = async (item: any) => {
    if (playlistIds.includes(item.id)) return;

    const res = await fetch("/api/dongeng/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dongeng_id: item.id }),
    });

    if (res.ok) await getPlaylist();
  };

  const handleDeletePlaylist = async (id: string) => {
    const res = await fetch(`/api/dongeng/playlist/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await getPlaylist();
    }
  };

  return (
    <div className="flex flex-col items-start lg:flex-row gap-6 px-4 sm:px-6 md:px-10 pt-6 min-h-screen py-10">
      {/* ============================= */}
      {/* 🔹 Bagian Daftar Dongeng */}
      {/* ============================= */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Ngupingkeun Dongeng
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataDongeng.map((item: any, index: number) => {
            const alreadyInPlaylist = playlistIds.includes(item.id);
            return (
              <div
                key={index}
                className="flex flex-col bg-white rounded-xl justify-between gap-4 p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                {/* Foto */}
                <div className="rounded-full bg-gray-400 w-24 h-24 self-center"></div>

                {/* Judul */}
                <span className="text-lg font-semibold text-center text-gray-800">
                  {item.judul}
                </span>

                {/* Eusi */}
                <span className="text-sm text-gray-600 line-clamp-4 text-justify">
                  {item.eusi}
                </span>

                {/* Lokasi */}
                <div className="flex gap-2 items-start text-gray-700 text-sm">
                  <MdPlace size={18} />
                  <div className="flex flex-col">
                    <span>Kecamatan: {item.kecamatan}</span>
                    <span>Desa: {item.desa}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2 items-center text-gray-700 text-sm">
                    <GrView />
                    <span>{item.view}</span>
                  </div>

                  <div className="flex gap-2">
                    {/* Play */}
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

                    {/* Add Playlist */}
                    <Button
                      size="icon"
                      disabled={alreadyInPlaylist}
                      onClick={() => handleAddToPlaylist(item)}
                      className={`p-2 rounded-full text-white ${
                        alreadyInPlaylist
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {alreadyInPlaylist ? (
                        <FaCheckCircle size={36} />
                      ) : (
                        <FaPlus size={36} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================= */}
      {/* 🔹 Bagian Playlist */}
      {/* ============================= */}
      <div
        className="
          w-full lg:w-1/3 xl:w-1/4 
          bg-[#fafafa] 
          rounded-xl border border-gray-300 shadow-md 
          flex flex-col mt-16 h-fit
        "
      >
        <div className="p-5 border-b border-gray-200 shrink-0">
          <h1 className="text-lg font-semibold">
            Daptar Dongéng anu badé dikupingkeun
          </h1>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {dataPlaylist.length > 0 ? (
            dataPlaylist.map((item: any, index: number) => (
              <div
                className="flex justify-between items-center border-b border-gray-200 pb-2"
                key={index}
              >
                <div className="flex gap-2 items-center">
                  <div className="rounded-full w-8 h-8 bg-gray-500"></div>
                  <span className="text-gray-800">
                    {typeof item.dongeng_id === "object"
                      ? item.dongeng_id.judul
                      : item.dongeng_id}
                  </span>
                </div>
                <CgPlayListRemove
                  size={25}
                  color="red"
                  className="cursor-pointer"
                  onClick={() => handleDeletePlaylist(item.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-sm text-center">
              Tambihkeun heula dongeng ka playlist!
            </div>
          )}
        </div>

        {/* Footer Kontrol */}
        <div className="border-t border-gray-200 p-5 flex justify-around items-center shrink-0">
          <IoPlayBack size={30} className="cursor-pointer" />
          <FaPlay size={30} className="cursor-pointer" />
          <IoPlayForward size={30} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default NgupingkeunPage;
