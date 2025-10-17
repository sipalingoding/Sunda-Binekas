"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Fix icon Leaflet tidak muncul di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.icon({
  iconUrl:
    "https://cdn.mapmarker.io/api/v1/pin?size=50&background=%23ff0000&icon=fa-heart&color=%23FFFFFF&voffset=0",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

type MapViewType = {
  data: any;
};

export default function MapView({ data }: MapViewType) {
  const router = useRouter();

  const grouped = groupByLatLan(data);

  function groupByLatLan(dataKoor: any) {
    const map = new Map();
    dataKoor.forEach((item: any) => {
      const key = `${item.lat}-${item.lan}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return Array.from(map.values());
  }

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
      return (
      {grouped.map((group: any, index: number) => (
        <Marker key={index} position={[group[0].lat, group[0].lan]}>
          <Popup>
            {group.length === 1 ? (
              <div className="flex flex-col justify-center items-center gap-2">
                <span className="text-sm font-bold italic">
                  {group[0].judul}
                </span>
                <Button
                  variant="white"
                  onClick={() => router.replace(`/maos/detail/${group[0].id}`)}
                >
                  Maca
                </Button>
              </div>
            ) : (
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                className="w-[220px] swiper-right-pagination"
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
              >
                {group.map((item: any, i: number) => (
                  <SwiperSlide key={i}>
                    <div className="flex flex-col justify-center items-center gap-2 p-2">
                      <span className="text-base font-bold italic text-center">
                        {item.judul}
                      </span>
                      <Button
                        variant="white"
                        onClick={() =>
                          router.replace(`/maos/detail/${item.id}`)
                        }
                      >
                        Maca
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Popup>
        </Marker>
      ))}
      );
    </MapContainer>
  );
}
