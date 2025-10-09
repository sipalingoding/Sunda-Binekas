"use client";

import { useRouter } from "next/navigation";
import React from "react";

type boxType = {
  judul: string;
  deskripsi: string;
  buttonText?: string;
  link?: string;
};

const BoxExplanation = ({ judul, deskripsi, buttonText, link }: boxType) => {
  const router = useRouter();
  return (
    <div className="bg-[#abd7d3] h-[600px] rounded-lg p-16 flex flex-col justify-start items-start gap-4 w-[1300px] absolute left-48 top-28 z-20">
      <b className="text-3xl">{judul}</b>
      <p className="text-xl">{deskripsi}</p>
      {buttonText && (
        <button
          onClick={() => router.push(link ?? "")}
          className="px-4 py-2 rounded-lg bg-[#98c5c2]"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default BoxExplanation;
