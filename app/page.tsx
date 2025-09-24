"use client";

import Image from "next/image";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const dataKeterangan = [
  {
    id: 1,
    title: "Tepas",
    description:
      " Wilujeng sumping dina website Peta Dongéng Sunda Digital. Dina ménu tepas sadérék bisa milih sababaraha ménu utama, diantawisn Maos Dongéng, Nyerat Dongéng, Nyiarkeun, Udunan jeung Warta",
    button: "",
  },
  {
    id: 2,
    title: "Maos Dongéng",
    description:
      "Didieu sadérék bisa maos dongéng ti unggal daérah utamana daerah Sunda, pikeun pangaweruh, panalungtikan atawa pancén ti sakola.",
    button: "Ngawitan Maos",
  },
  {
    id: 3,
    title: "Nyerat Dongéng",
    description:
      "Salian bisa maos dongéng dina ieu website saderek ogé bisa nyeratkeun dongéng lemburna séwang-séwangan. Sangkan bisa dibaca ku loba jalma, katambah pikeun ngadokuméntasikeun budaya sacara digital.",
    button: "Ngawitan Nyerat",
  },
  {
    id: 4,
    title: "Nyiarkeun",
    description:
      "Nyiarkeun asal kecapna tina si’ar, artina nyebarkeun. Bisa kana média sosial atawa platform séjénna. Sangkan ieu website loba anu ngaakses.",
    button: "Ngiring Nyiarkeun",
  },
  {
    id: 5,
    title: "Udunan",
    description:
      "Udunan mangrupa istilah séjén tina réréongan atawa sabilulungan. Hartosna ménu pikeun ngarojong boh sacara matéril boh non-matéril.",
    button: "Ngiring Udunan",
  },
  {
    id: 6,
    title: "Warta",
    description:
      "Iber atawa béja singget  ngeunaan ieu website. Boh iber ngeunaan saha anu nyieunna, saha waé anu kontribusina jeung sajabana.",
    button: "Iber Lengkepna",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === dataKeterangan.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? dataKeterangan.length - 1 : prev - 1
    );
  };

  const currentData = dataKeterangan[currentIndex];
  return (
    <div className="flex min-h-screen p-12 bg-[#96C4C2]">
      <Sidebar setCurrentIndex={setCurrentIndex} />
      <div className="ml-20 flex justify-around gap-5 p-12 w-full">
        <Image
          src="/images/peta.png"
          alt="Background"
          width={450}
          height={750}
          className="object-contain"
        />
        <div className="w-[800px] h-[400px] bg-[#abd7d3] rounded-xl p-10 flex gap-4 items-center">
          <FaCircleArrowLeft
            size={30}
            className="cursor-pointer"
            onClick={handlePrev}
          />
          <div className="flex flex-col gap-5 flex-1">
            <span className="font-bold text-2xl">{currentData.title}</span>
            <span className="text-lg">{currentData.description}</span>
            {currentData.button && (
              <Button className="bg-[#96c3c1] w-36 self-center">
                {currentData.button}
              </Button>
            )}
          </div>
          <FaCircleArrowRight
            size={30}
            className="cursor-pointer"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
