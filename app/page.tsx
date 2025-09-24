"use client";

import Image from "next/image";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { FcHome } from "react-icons/fc";
import { FaSearch } from "react-icons/fa";

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
  const [isMaca, setIsMaca] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [isDetail, setIsDetail] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === dataKeterangan.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!isMaca) {
      setIsDetail(false);
    }
  }, [isMaca]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? dataKeterangan.length - 1 : prev - 1
    );
  };

  const handleClickButton = (id: any) => {
    if (id === 2) {
      setIsMaca(true);
    }
  };

  const handleDetail = () => {
    setIsDetail(true);
  };

  const currentData = dataKeterangan[currentIndex];
  return (
    <div className="flex min-h-screen p-12 bg-[#96C4C2] relative">
      <Sidebar setCurrentIndex={setCurrentIndex} setIsMaca={setIsMaca} />

      {/* Background dengan ukuran kecil */}
      <div
        className="absolute top-20 left-40 w-[1700px] h-[800px] bg-no-repeat bg-contain"
        style={{ backgroundImage: "url('/images/INTRO.png')" }}
      />

      {isMaca && (
        <FcHome
          size={50}
          className="absolute z-20 left-96 top-64 cursor-pointer"
          onClick={handleDetail}
        />
      )}

      {/* Konten utama */}
      <div className="flex justify-end gap-5 p-12 w-full relative z-10">
        {!isMaca ? (
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
                <Button
                  className="bg-[#96c3c1] w-36 self-center"
                  onClick={() => handleClickButton(currentData.id)}
                >
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
        ) : (
          <div className="flex flex-col gap-10 items-end">
            <form
              onSubmit={handleSearch}
              className="flex items-center border border-black rounded-full px-4 py-2 w-[300px] h-[30px]"
            >
              {/* Icon search */}
              <FaSearch className="text-black mr-2" />

              {/* Input text */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-black border-none outline-none focus:ring-0"
              />
            </form>{" "}
            {isDetail && (
              <div className="w-[800px] h-[400px] bg-[#abd7d3] rounded-xl p-10 flex gap-4 items-center">
                <div className="flex flex-col gap-5 flex-1">
                  <span className="font-bold text-2xl">Kawunglarang</span>
                  <span className="text-lg">
                    Aya hiji kulawarga anu pagawéanana nyadap legén ka kebon.
                    Dina hiji poé patani éta manggihan hiji tangkal kawung, anu
                    satuluyna ku manéhana tuluy disadap, tapi ku anéhna
                    sababaraha kali di sadap teu kaluar waé caina. Nepi ka tilu
                    kalina patani éta nyobaan nyadap angger teu kaluar kénéh,
                    nepi ka patani éta ragrag ucap saperti kieu “Ari manéh
                    larang larang teuing kuring ngala legén didieu”. Ti harita
                    éta lembur dingaranan Kawunglarang. Artina tangkal kawung
                    anu larang atawa teu ngijinan di ala. Jeung kacaritakeun
                    tangkal kawung anu teu kaluar cai legénna téh tempatna
                    nyaéta anu ayeuna jadi balé désa Kawunglarang.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
