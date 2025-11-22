"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { MdPlace } from "react-icons/md";

const NgadeklamasikeunPage = () => {
  const router = useRouter();
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItem, setLoadingItem] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getDataMap()]);
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

    // filter hanya yang belum approved
    const filtered = (data || []).filter(
      (item: any) => item.status_audio !== "approved"
    );

    setDataDongeng(filtered);
  };

  const handleRouter = (id: string) => {
    setLoadingItem(id);
    router.replace(`/ngadeklamasikeun/detail/${btoa(id)}`);
  };

  return (
    <div
      className="flex flex-col items-start gap-6 px-4 sm:px-6 md:px-10 pt-6 min-h-screen py-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bghome.png')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Ngadeklamasikeun Dongeng
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataDongeng.map((item: any, index: number) => {
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
                  <GrView />
                  <span>{item.view}</span>
                </div>
                <Button
                  className="bg-gray-400 text-white"
                  onClick={() => handleRouter(item?.id)}
                >
                  {loadingItem == item.id ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Pilih</span>
                    </>
                  ) : (
                    "Pilih"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NgadeklamasikeunPage;
