"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // 🌀 Spinner
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

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
  useEffect(() => {
    return () => {
      const mapContainers = document.querySelectorAll(".leaflet-container");
      mapContainers.forEach((el) => {
        (el as any)._leaflet_id = null;
      });
    };
  }, []);

  return (
    <MapContainer
      center={[data.lat, data.lan]}
      key={`${data.lat}-${data.lan}`}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
      className="relative z-0 md:z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      <Marker position={[data.lat, data.lan]}>
        <Popup>
          <div className="lf-popup">
            <span className="lf-popup-label">Lokasi Dongéng</span>
            <h3 className="lf-popup-title">{data.kabupaten}</h3>
            <div className="lf-popup-divider" />
            <div className="lf-popup-meta">
              {data.kecamatan && (
                <div className="lf-popup-row">
                  <span className="lf-popup-key">Kecamatan</span>
                  <span className="lf-popup-val">{data.kecamatan}</span>
                </div>
              )}
              {data.desa && (
                <div className="lf-popup-row">
                  <span className="lf-popup-key">Desa</span>
                  <span className="lf-popup-val">{data.desa}</span>
                </div>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
