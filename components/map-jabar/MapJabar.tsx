"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useEffect, useState } from "react";
import { geoCentroid } from "d3-geo";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation"; // ✅ gunakan navigation, bukan router

type MapViewType = {
  data: {
    id: string;
    judul: string;
    kabupaten: string;
    lat: number;
    lan: number;
  }[];
};

export default function MapJabar({ data }: MapViewType) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any | null>(null);
  const [popup, setPopup] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  useEffect(() => {
    async function fetchGeoData() {
      setLoading(true);
      const res = await fetch("/api/maps/jabar");
      const data = await res.json();
      setGeoData(data);
      setLoading(false);
    }
    fetchGeoData();
  }, []);

  if (loading) {
    return (
      <Skeleton className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg bg-[#fafafa]" />
    );
  }

  // urutkan kabupaten/kota berdasarkan OBJECTID
  const sortedRegions = geoData.features
    .map((f: any) => ({
      id: f.properties.OBJECTID,
      name: f.properties.KABKOT,
    }))
    .sort((a: any, b: any) => a.id - b.id);

  // 🔹 Bagi menjadi 4 kolom
  const quarter = Math.ceil(sortedRegions.length / 4);
  const col1 = sortedRegions.slice(0, quarter);
  const col2 = sortedRegions.slice(quarter, quarter * 2);
  const col3 = sortedRegions.slice(quarter * 2, quarter * 3);
  const col4 = sortedRegions.slice(quarter * 3);

  function groupByKabupaten(dataKoor: any[]) {
    const map = new Map<string, any[]>();
    dataKoor?.forEach((item) => {
      const key = item.kabupaten;
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(item);
    });

    return Array.from(map.entries()).map(([kabupaten, items]) => ({
      kabupaten,
      items,
      lat: items[0].lat,
      lan: items[0].lan,
    }));
  }

  const grouped = groupByKabupaten(data);

  const getDongengCount = (name: string) => {
    const found = grouped.find((g) => {
      const clean = (str: string) =>
        str
          .replace(/KABUPATEN|KOTA/gi, "")
          .trim()
          .toLowerCase();
      return clean(g.kabupaten) === clean(name);
    });
    return found?.items.length || 0;
  };

  // ✅ perbaiki fungsi redirect
  const handleMacaClick = (jumlah: number) => {
    if (jumlah === 0) {
      setPopup(null);
      return;
    }

    if (!popup?.name) return;

    setLoadingButton(true);

    let kabupatenName = popup.name.trim().toUpperCase();
    if (!kabupatenName.includes("KOTA")) {
      kabupatenName = `KABUPATEN ${kabupatenName}`;
    }

    const encodedKabupaten = encodeURIComponent(kabupatenName);
    router.push(`/maos/detail/kabupaten?kabupaten=${encodedKabupaten}`);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* 🗺️ MAP */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 10000,
          center: [107.5, -6.9],
        }}
        width={800}
        height={600}
      >
        <Geographies geography={geoData}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const centroid = geoCentroid(geo);
              const kabkot = geo.properties.KABKOT;
              const id = geo.properties.OBJECTID;

              return (
                <g key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    onClick={() => setSelected(kabkot)}
                    style={{
                      default: {
                        fill: selected === kabkot ? "#0ea5e9" : "#e2e8f0",
                        stroke: "#64748b",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: { fill: "#38bdf8", outline: "none" },
                      pressed: { fill: "#0284c7", outline: "none" },
                    }}
                  />

                  {centroid && (
                    <Marker coordinates={centroid}>
                      <g
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopup({ name: kabkot });
                          setSelected(kabkot);
                        }}
                        className="cursor-pointer"
                      >
                        <circle
                          r={8}
                          fill={selected === kabkot ? "#0284c7" : "#0ea5e9"}
                          stroke="#fff"
                          strokeWidth={1.5}
                        />
                        <text
                          textAnchor="middle"
                          y={3.5}
                          fontSize={8}
                          fontWeight={600}
                          fill="#fff"
                          pointerEvents="none"
                        >
                          {id}
                        </text>
                      </g>
                    </Marker>
                  )}
                </g>
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* 🧭 POPUP */}
      {popup && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setPopup(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg text-center min-w-[250px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Dongeng Wilayah</h3>
            <p className="text-gray-700">{popup.name}</p>
            <h3 className="text-lg font-semibold mb-2">Jumlah Dongeng</h3>

            {/* 🔢 Hitung jumlah */}
            <p className="text-gray-700">{getDongengCount(popup.name)}</p>

            {/* 🟢 Tombol dinamis */}
            <button
              className={`mt-4 px-4 py-2 rounded-lg text-white ${
                getDongengCount(popup.name) > 0
                  ? "bg-sky-500 hover:bg-sky-600"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              onClick={() => handleMacaClick(getDongengCount(popup.name))}
            >
              {getDongengCount(popup.name) > 0 ? "Maca" : "Tutup"}
            </button>
          </div>
        </div>
      )}

      {/* 📋 LIST KABUPATEN/KOTA */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 text-sm mt-4 px-4">
        {[col1, col2, col3, col4].map((col, i) => (
          <div key={i}>
            {col.map((item: any) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 py-1 cursor-pointer hover:text-sky-600 ${
                  selected === item.name ? "font-semibold text-sky-700" : ""
                }`}
                onClick={() => {
                  setSelected(item.name);
                  setPopup({ name: item.name });
                }}
              >
                <span className="font-medium w-5 text-right">{item.id}.</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
