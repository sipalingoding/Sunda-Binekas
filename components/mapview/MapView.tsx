"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // 🌀 Spinner
import "leaflet/dist/leaflet.css";

// ✅ Fix icon Leaflet agar muncul
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔹 Sekarang hanya menerima satu objek, bukan array
type MapViewType = {
  data: {
    id: string;
    judul: string;
    kabupaten: string;
    kecamatan: string;
    desa: string;
    lat: number;
    lan: number;
  };
};

export default function MapView({ data }: MapViewType) {
  return (
    <MapContainer
      center={[data.lat, data.lan]}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
      className="relative z-0 md:z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {/* 🟢 Satu marker saja */}
      <Marker position={[data.lat, data.lan]}>
        <Popup>
          <div className="flex flex-col items-center text-center gap-2">
            <h3 className="font-bold">{data.kabupaten}</h3>
            <div className="flex flex-col items-start -space-y-4">
              <p className="text-sm">kecamatan : {data.kecamatan}</p>
              <p className="text-sm">desa : {data.desa}</p>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
