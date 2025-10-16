"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

// Import MapView secara dinamis agar tidak dirender di server
const MapView = dynamic(() => import("@/components/mapview/MapView"), {
  ssr: false,
});

const PetaPage = () => {
  const [dataLokasi, setDataLokasi] = useState([]);

  useEffect(() => {
    getDataMap();
  }, []);

  const getDataMap = async () => {
    const res = await fetch("/api/dongeng/approved", {
      method: "GET",
    });
    const { data } = await res.json();
    setDataLokasi(data || []);
  };

  return (
    <div className="bg-[#abd7d3] h-[700px] rounded-lg w-[1300px] absolute left-48 top-28 z-20">
      <MapView data={dataLokasi} />
    </div>
  );
};

export default PetaPage;
