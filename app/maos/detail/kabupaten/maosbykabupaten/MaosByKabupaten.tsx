"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { MdPlace } from "react-icons/md";
import { GrView } from "react-icons/gr";

export default function MaosByKabupatenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kabupaten = searchParams?.get("kabupaten") ?? "";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedDongengKecamatan, setSelectedDongengKecamatan] =
    useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");
  const [dongengList, setDongengList] = useState<any[]>([]);

  // search filter
  const [searchKecamatan, setSearchKecamatan] = useState("");
  const [searchDesa, setSearchDesa] = useState("");

  const [loadingDongeng, setLoadingDongeng] = useState(false);

  // Ambil data awal kabupaten dari API lokal
  useEffect(() => {
    if (!kabupaten) return;
    setLoading(true);

    fetch(
      `/api/dongeng/by-kabupaten?kabupaten=${encodeURIComponent(kabupaten)}`
    )
      .then((r) => r.json())
      .then((json) => {
        setData(json.data || []);
        setDongengList(json.data || []); // tampilkan dongeng kabupaten langsung
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [kabupaten]);

  // Ambil daftar kecamatan
  useEffect(() => {
    if (!data[0]?.kabupaten) return;

    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/32.json")
      .then((res) => res.json())
      .then((kabupatenList) => {
        const found = kabupatenList.find((item: any) =>
          item.name
            .toLowerCase()
            .includes(data[0].kabupaten.replace("KABUPATEN ", "").toLowerCase())
        );

        if (found) {
          fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${found.id}.json`
          )
            .then((res) => res.json())
            .then((result) => setKecamatanList(result))
            .catch((err) => console.error("Gagal ambil kecamatan:", err));
        }
      })
      .catch((err) => console.error("Gagal ambil kabupaten:", err));
  }, [data]);

  // Ambil desa berdasarkan kecamatan
  useEffect(() => {
    if (!selectedKecamatan) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKecamatan}.json`
    )
      .then((res) => res.json())
      .then((data) => setDesaList(data))
      .catch((err) => console.error("Gagal ambil desa:", err));
  }, [selectedKecamatan]);

  // 🔍 Fungsi pencarian manual
  const handleSearchDongeng = async () => {
    setLoadingDongeng(true);
    try {
      const res = await fetch("/api/dongeng/by-wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kecamatan: selectedDongengKecamatan,
          desa: selectedDesa,
        }),
      });

      const json = await res.json();
      setDongengList(json.data || []);
    } catch (err) {
      console.error("Gagal memuat dongeng:", err);
    } finally {
      setLoadingDongeng(false);
    }
  };

  const handleMaca = (id: string) => {
    setLoadingItem(id);
    router.push(`/maos/detail/${btoa(id)}`);
  };

  if (!kabupaten) {
    return <div className="p-8">Kabupaten tidak ditentukan.</div>;
  }

  const filteredKecamatanList = kecamatanList.filter((item) =>
    item.name.toLowerCase().includes(searchKecamatan.toLowerCase())
  );

  const filteredDesaList = desaList.filter((item) =>
    item.name.toLowerCase().includes(searchDesa.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen flex flex-col">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Dongéng di {kabupaten}
      </h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
        {/* Dropdown Filter */}
        <div className="flex flex-col lg:flex-row gap-4 w-full mx-auto lg:mx-0 items-end items-center">
          {/* Kecamatan */}
          <div className="w-full lg:w-1/3">
            <Select
              onValueChange={(value) => {
                const selected = kecamatanList.find((k) => k.name === value);
                if (selected) {
                  setSelectedKecamatan(selected.id);
                  setSelectedDongengKecamatan(selected.name);
                }
              }}
            >
              <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black max-h-72 overflow-y-auto p-2">
                <Input
                  placeholder="Cari Kecamatan..."
                  value={searchKecamatan}
                  onChange={(e) => setSearchKecamatan(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                {filteredKecamatanList.length > 0 ? (
                  filteredKecamatanList.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">
                    Tidak ditemukan
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Desa */}
          <div className="w-full lg:w-1/3">
            <Select
              onValueChange={(value) => {
                const selected = desaList.find((k) => k.name === value);
                if (selected) setSelectedDesa(selected.name);
              }}
            >
              <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
                <SelectValue placeholder="Pilih Desa (Opsional)" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black max-h-72 overflow-y-auto p-2">
                <Input
                  placeholder="Cari Desa..."
                  value={searchDesa}
                  onChange={(e) => setSearchDesa(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                {filteredDesaList.length > 0 ? (
                  filteredDesaList.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">
                    Pilih kecamatan terlebih dahulu
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tombol */}
          <div className="w-full lg:w-auto">
            <Button
              onClick={handleSearchDongeng}
              className="bg-gray-800 text-white w-full lg:w-auto"
              disabled={loadingDongeng}
            >
              {loadingDongeng ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Teangan...
                </>
              ) : (
                "Teangan"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 🧾 List Dongeng */}
      <div className="mt-6">
        {loadingDongeng ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-4 h-4" /> Memuat...
          </div>
        ) : dongengList.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dongengList.map((item, index) => (
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
                    className="w-fit px-3 py-1 bg-gray-600 text-white text-xs sm:text-sm flex items-center justify-center gap-2"
                    onClick={() => handleMaca(item.id)}
                    disabled={loadingItem === item.id}
                  >
                    {loadingItem === item.id ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Maos</span>
                      </>
                    ) : (
                      "Maos"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">Teu acan aya dongéng.</div>
        )}
      </div>
    </div>
  );
}
