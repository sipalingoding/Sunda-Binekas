"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

  // 🔹 Ambil dongeng berdasarkan kabupaten dari API internal kamu
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

  // 🔹 Setelah data kabupaten didapat, ambil ID kabupaten dari Emsifa
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

          // Ambil daftar kecamatan
          fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${found.id}.json`
          )
            .then((res) => res.json())
            .then((result) => setKecamatanList(result))
            .catch((err) => console.error("Gagal ambil kecamatan:", err));
        } else {
          console.error("Kabupaten tidak ditemukan:", data[0]?.kabupaten);
        }
      })
      .catch((err) => console.error("Gagal ambil kabupaten:", err));
  }, [data]);

  // 🔹 Saat user pilih kecamatan → ambil daftar desa berdasarkan ID kecamatan
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

  return (
    <div className="p-8 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Dongéng di {kabupaten}</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-2">
        <div>
          <Image
            src={"/images/map-jabar.png"}
            width={1000}
            height={1000}
            alt="map-jabar"
          />
        </div>

        <div className="flex flex-col px-4 justify-center gap-4">
          {/* Select Kecamatan */}
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
            <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
              {kecamatanList.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const selected = desaList.find((k) => k.name === value);
              if (selected) setSelectedDesa(selected.name);
            }}
          >
            <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
              <SelectValue placeholder="Pilih Desa" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
              {desaList.length > 0 ? (
                desaList.map((item) => (
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
          <Select
            disabled={!selectedDesa}
            onValueChange={(value) => {
              setSelectedDongeng(value);
            }}
          >
            <SelectTrigger className="bg-white text-black border border-gray-300 w-full min-h-[50px]">
              <SelectValue placeholder="Pilih Dongeng" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black max-h-60 overflow-y-auto">
              {filteredDongeng.length > 0 ? (
                filteredDongeng.map((item) => (
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
            className="bg-[#fafafa]"
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
