"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const NyeratPage = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-8 md:px-16 py-6 md:py-10">
      {/* Judul */}
      <h1 className="font-bold text-2xl sm:text-3xl text-center md:text-left">
        Nyerat Dongeng
      </h1>

      {/* Deskripsi */}
      <p className="text-sm sm:text-base leading-relaxed text-justify">
      Dina ieu website, salian bisa maos dongéng urang ogé bisa nyerat dongéng ti lembur séwang-séwangan. Tujuanna pikeun ngadokuméntasikeun budaya sacara digital jeung ngawanohkeun dongéng-dongéng ti sakuliah tatar Jawa Barat.
      </p>

      <p className="text-sm sm:text-base leading-relaxed text-justify">
      Tapi saacan nyerat dongéng aya sababaraha katangtuan anu kudu disapukan. Diantarana nyaéta: <br />
        <br />
        1. Saacan nyerat, eusian heula identitas kalayan lengkep; <br />
        2. Anu nyerat kudu nyantumkeun sumber dongéng, boh sumberna tina tradisi lisan masyarakat boh tina literatur tinulis (buku) kalayan ijin pangarangna; jeung
        <br />
        3. Kersa nampi saran tinu maca saupama dongéng anu ditulis dirasa kurang
        payus atawa perlu didiskusikeun.
      </p>

      {/* Checkbox dan Tombol */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 sm:mt-16 gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={(value) => setIsChecked(!!value)}
          />
          <Label
            htmlFor="terms"
            className="text-sm sm:text-base leading-snug cursor-pointer"
          >
            Satuju kana katangtuan anu tos ditangtoskeun
          </Label>
        </div>

        <Button
          className="w-full sm:w-fit bg-gray-800 text-white hover:bg-gray-700 transition"
          onClick={() => router.replace("/nyerat/form")}
          disabled={!isChecked}
        >
          Ngawitan Nyerat
        </Button>
      </div>
    </div>
  );
};

export default NyeratPage;
