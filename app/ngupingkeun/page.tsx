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

    // stop speech ketika user keluar dari halaman
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
    // Jika sedang memutar yang sama → pause/stop
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

    // Simpan ke ref agar bisa di-cancel nanti
    speechRef.current = utterance;

    // Play
    window.speechSynthesis.speak(utterance);
    setPlayingId(item.id);
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold">Ngupingkeun Dongeng</h1>
      <div className="flex flex-wrap gap-4 items-start">
        {dataDongeng.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-col w-64 min-h-80 bg-[#fafafa] rounded-lg justify-between gap-4 px-4 p-4 shadow-sm border"
          >
            <div className="rounded-full bg-gray-500 w-20 h-20 self-center"></div>

            <span className="text-base font-semibold text-center self-center">
              {item.judul}
            </span>

            <span className="text-xs font-light line-clamp-4">{item.eusi}</span>

            <div className="flex gap-2 items-center">
              <MdPlace />
              <div className="flex flex-col text-xs">
                <span>Kecamatan: {item.kecamatan}</span>
                <span>Desa: {item.desa}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <GrView />
                <span className="text-xs">{item.view}</span>
              </div>

              <Button
                className="w-fit bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => handlePlay(item)}
              >
                {playingId === item.id ? (
                  <IoPauseCircleOutline size={40} />
                ) : (
                  <IoPlayCircleOutline size={40} />
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
