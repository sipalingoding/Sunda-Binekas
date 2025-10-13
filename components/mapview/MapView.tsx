"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Fix icon Leaflet tidak muncul di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MapViewType = {
  data: any;
};

export default function MapView({ data }: MapViewType) {
  const router = useRouter();
  return (
    <MapContainer
      center={[-6.9218457, 107.6070833]} // contoh: Garut
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {data.map((item: any, index: number) => {
        return (
          <Marker key={index} position={[item.lat, item.lan]}>
            <Popup>
              <div className="flex flex-col justify-center items-center gap-2">
                <span className="text-lg font-bold italic">{item.judul}</span>
                <Button
                  variant="white"
                  onClick={() => router.replace(`/maos/detail/${item.id}`)}
                >
                  Maca
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
