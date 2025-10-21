"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

// ✅ Fix icon Leaflet agar muncul
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MapViewType = {
  data: {
    id: string;
    judul: string;
    kabupaten: string;
    lat: number;
    lan: number;
  }[];
};

export default function MapView({ data }: MapViewType) {
  const router = useRouter();

  // 🔹 Kelompokkan berdasarkan kabupaten
  function groupByKabupaten(dataKoor: any[]) {
    const map = new Map<string, any[]>();
    dataKoor.forEach((item) => {
      const key = item.kabupaten;
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(item);
    });

    return Array.from(map.entries()).map(([kabupaten, items]) => ({
      kabupaten,
      items,
      lat: items[0].lat, // ambil posisi dari data pertama
      lan: items[0].lan,
    }));
  }

  const grouped = groupByKabupaten(data);

  return (
    <MapContainer
      key={grouped.length}
      center={[-6.9218457, 107.6070833]}
      zoom={9}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* 🔹 Render marker per kabupaten */}
      {grouped.map((group, index) => (
        <Marker key={index} position={[group.lat, group.lan]}>
          <Popup>
            <div className="flex flex-col items-center text-center">
              <h3 className="font-bold">{group.kabupaten}</h3>
              <p className="text-sm">Jumlah dongéng: {group.items.length}</p>
              <Button
                className="text-sm bg-[#fafafa]"
                onClick={() =>
                  router.push(
                    `/maos/detail/kabupaten?kabupaten=${encodeURIComponent(
                      group.kabupaten
                    )}`
                  )
                }
              >
                Maca
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
