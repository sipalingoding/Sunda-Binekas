"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { MdPlace } from "react-icons/md";

const NgadeklamasikeunPage = () => {
  const router = useRouter();
  const [dataDongeng, setDataDongeng] = useState<any[]>([]);
  const [loadingItem, setLoadingItem] = useState<string>();
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");

  const [searchKab, setSearchKab] = useState("");
  const [searchKec, setSearchKec] = useState("");
  const [searchDesa, setSearchDesa] = useState("");

  const [kabupatenList, setKabupatenList] = useState<any[]>([]);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getDataMap()]);
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

  const handleFilter = async () => {
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
      setDataDongeng(data);
    } catch (err) {
      console.error(err);
    }
  };

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
      className="flex flex-col items-start gap-6 px-4 sm:px-6 md:px-10 pt-6 min-h-screen py-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bghome.png')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Ngadeklamasikeun Dongeng
      </h1>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <Select onValueChange={setSelectedKabupaten} value={selectedKabupaten}>
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
