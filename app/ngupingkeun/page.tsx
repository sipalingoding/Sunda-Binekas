"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { GrView } from "react-icons/gr";
import { MdPlace } from "react-icons/md";
import { IoPlayCircleOutline, IoPauseCircleOutline } from "react-icons/io5";

const NgupingkeunPage = () => {
  const router = useRouter();
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    getDataMap();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getDataMap = async () => {
    const res = await fetch("/api/dongeng");
    const { data } = await res.json();
    setDataDongeng(data || []);
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

    utterance.onend = () => {
      setPlayingId(null);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlayingId(item.id);
  };

  return (
    <div className="flex flex-col gap-8 px-6 sm:px-8 md:px-12 lg:px-24 py-8">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        Ngupingkeun Dongeng
      </h1>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataDongeng.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-col bg-[#fafafa] rounded-xl justify-between gap-4 p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            {/* Foto / Avatar */}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NgupingkeunPage;
