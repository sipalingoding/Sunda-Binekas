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

export default function MaosByKabupatenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kabupaten = searchParams?.get("kabupaten") ?? "";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataKabupaten, setDataKabupaten] = useState<any>(null);
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaList, setDesaList] = useState<any[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedDongengKecamatan, setSelectedDongengKecamatan] =
    useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");
  const [filteredDongeng, setFilteredDongeng] = useState<any[]>([]);
  const [selectedDongeng, setSelectedDongeng] = useState<string>("");

  // search
  const [searchKecamatan, setSearchKecamatan] = useState("");
  const [searchDesa, setSearchDesa] = useState("");
  const [searchDongeng, setSearchDongeng] = useState("");

  useEffect(() => {
    if (!kabupaten) return;
    setLoading(true);

    fetch(
      `/api/dongeng/by-kabupaten?kabupaten=${encodeURIComponent(kabupaten)}`
    )
      .then((r) => r.json())
      .then((json) => setData(json.data || []))
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [kabupaten]);

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
          setDataKabupaten(found);
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

  useEffect(() => {
    if (!selectedKecamatan) return;

    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKecamatan}.json`
    )
      .then((res) => res.json())
      .then((data) => setDesaList(data))
      .catch((err) => console.error("Gagal ambil desa:", err));
  }, [selectedKecamatan]);

  useEffect(() => {
    if (!selectedDongengKecamatan && !selectedDesa) return;

    const fetchDongeng = async () => {
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
        setFilteredDongeng(json.data || []);
      } catch (err) {
        console.error("Gagal memuat dongeng:", err);
      }
    };

    fetchDongeng();
  }, [selectedDesa]);

  if (!kabupaten) {
    return <div className="p-8">Kabupaten tidak ditentukan.</div>;
  }

  const filteredKecamatanList = kecamatanList.filter((item) =>
    item.name.toLowerCase().includes(searchKecamatan.toLowerCase())
  );

  const filteredDesaList = desaList.filter((item) =>
    item.name.toLowerCase().includes(searchDesa.toLowerCase())
  );

  const filteredDongengList = filteredDongeng.filter((item) =>
    item.judul.toLowerCase().includes(searchDongeng.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen flex flex-col">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Dongéng di {kabupaten}
      </h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* ✅ Grid Responsif */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Gambar */}
        <div className="flex justify-center">
          <Image
            src={"/images/map-jabar.png"}
            width={800}
            height={800}
            alt="map-jabar"
            className="w-full max-w-md sm:max-w-lg h-auto object-contain"
          />
        </div>

        {/* Dropdown Filter */}
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto lg:mx-0">
          {/* Kecamatan */}
          <Select
            onValueChange={(value) => {
              const selected = kecamatanList.find((k) => k.name === value);
              if (selected) {
                setSelectedKecamatan(selected.id);
                setSelectedDongengKecamatan(selected.name);
                setFilteredDongeng([]);
                setSelectedDesa("");
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
                <div className="p-2 text-sm text-gray-500">Tidak ditemukan</div>
              )}
            </SelectContent>
          </Select>

          {/* Desa */}
          <Select
            onValueChange={(value) => {
              const selected = desaList.find((k) => k.name === value);
              if (selected) setSelectedDesa(selected.name);
            }}
          >
            <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
              <SelectValue placeholder="Pilih Desa" />
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

          {/* Dongeng */}
          <Select
            disabled={!selectedDesa}
            onValueChange={(value) => setSelectedDongeng(value)}
          >
            <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
              <SelectValue placeholder="Pilih Dongeng" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black max-h-72 overflow-y-auto p-2">
              <Input
                placeholder="Cari Dongeng..."
                value={searchDongeng}
                onChange={(e) => setSearchDongeng(e.target.value)}
                className="mb-2 h-8 text-sm"
              />
              {filteredDongengList.length > 0 ? (
                filteredDongengList.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.judul}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  Teu Acan Aya Dongeng
                </div>
              )}
            </SelectContent>
          </Select>

          <Button
            className="bg-gray-800 text-white py-2 hover:bg-gray-700 transition"
            onClick={() => router.replace(`/maos/detail/${selectedDongeng}`)}
            disabled={!selectedDongeng}
          >
            Maca
          </Button>
        </div>
      </div>
    </div>
  );
}
