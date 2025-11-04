"use client";

import dynamic from "next/dynamic";
import React from "react";

const MapView = dynamic(() => import("./../../../components/mapview/MapView"), {
  ssr: false,
});

export default function MapViewWrapper({ data }: { data: any }) {
  return <MapView data={data} key={`${data.id}-${data.lat}-${data.lan}`} />;
}
