"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { MdPlace } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const MapView = dynamic(() => import("@/components/mapview/MapView"), {
  ssr: false,
});

export default function Maos() {
  const router = useRouter();
  const [dataLokasi, setDataLokasi] = useState<any[]>([]);
  const [dongengPopular, setDongengPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataMap();
  }, []);

  const getDataMap = async () => {
    try {
      const res = await fetch("/api/dongeng/approved");
      const { data } = await res.json();
      setDataLokasi(data || []);
      getTop4ByView(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function getTop4ByView(data: any) {
    const sorted = [...data].sort((a, b) => b.view - a.view);
    const dataMap = sorted.slice(0, 4).map((item) => ({
      ...item,
      eusi:
        item.eusi.length > 20
          ? item.eusi.slice(0, 20).trim() + "..."
          : item.eusi,
    }));
    setDongengPopular(dataMap);
  }

  return (
    <div className="flex flex-col flex-1 px-4 sm:px-8 md:px-16 py-6 md:py-10 gap-6 md:gap-8">
      {/* Judul */}
      <h1 className="font-bold text-2xl sm:text-3xl text-center md:text-left">
        Maos Dongeng
      </h1>

      {/* Peta */}
      {loading ? (
        <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg" />
      ) : dataLokasi.length > 0 ? (
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
          <MapView data={dataLokasi} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Tidak ada data lokasi
        </p>
      )}

      {/* Dongeng Populer */}
      <h1 className="font-bold text-lg sm:text-xl mt-4">Dongéng Populer</h1>

      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-6 
          justify-items-center
        "
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col w-full sm:w-64 bg-[#fafafa] rounded-lg p-4 shadow-sm gap-4"
              >
                <Skeleton className="w-20 h-20 rounded-full self-center" />
                <Skeleton className="h-4 w-3/4 self-center" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2 items-start text-xs">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </div>
            ))
          : dongengPopular.map((item: any, index: number) => (
              <div
                key={index}
                className="
                  flex flex-col 
                  w-full sm:w-64 
                  bg-[#fafafa] 
                  rounded-lg 
                  justify-between 
                  gap-4 
                  p-4 
                  shadow-sm
                "
              >
                {item?.photo ? (
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
                  <div className="rounded-full bg-gray-500 w-20 h-20 self-center"></div>
                )}

                <span className="text-base font-semibold text-center">
                  {item.judul}
                </span>

                <span className="text-xs font-light text-center">
                  {item.eusi}
                </span>

                <div className="flex gap-2 items-start text-xs">
                  <MdPlace className="mt-[2px]" />
                  <div className="flex flex-col">
                    <span>Kecamatan: {item.kecamatan}</span>
                    <span>Desa: {item.desa}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center text-xs">
                    <GrView />
                    <span>{item.view}</span>
                  </div>

                  <Button
                    className="w-fit px-3 py-1 bg-gray-600 text-white text-xs sm:text-sm"
                    onClick={() => router.push(`/maos/detail/${item.id}`)}
                  >
                    Maos
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
