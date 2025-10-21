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
    <div className="flex flex-col gap-4 p-24">
      <h1 className="font-bold text-3xl">Nyerat Dongeng</h1>
      <p>
        Salian bisa maos dongéng dina ieu website saderek ogé bisa nyeratkeun
        dongéng lemburna séwang-séwangan. Sangkan bisa dibaca ku loba jalma,
        katambah pikeun ngadokuméntasikeun budaya sacara digital.
      </p>
      <p>
        Tapi saacan nyerat dongéng peryogi kauninga perkawis katangtuan anu
        kedah disatujuan nu anu badé nyerat. Diantawisna nyaéta: <br />
        1. Saacan nulis, eusian heula identitas kalayan lengkep; <br />
        2. Anu nyerat kedah nyantumkeun sumber dongéng, boh sumberna tina
        tradisi lisan masyarakat boh tina literatur tinulis (buku) kalayan ijin
        pangarangna;
        <br />
        3. Kersa nampi saran tinu maca saupama dongeng anu ditulis dirasa kurang
        payus atawa perlu didiskusikeun.
      </p>
      <div className="flex flex-col items-end gap-2 self-end mt-20">
        <div className="flex items-center gap-3">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={(value) => setIsChecked(!!value)}
          />
          <Label htmlFor="terms">
            Satuju kana kantangtuan anu tos ditangtoskeun
          </Label>
        </div>
        <Button
          className="w-fit bg-[#fafafa]"
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
