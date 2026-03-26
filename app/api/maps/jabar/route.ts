import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Gunakan anon key karena ini hanya read (GET)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Ambil semua data dari tabel kabupaten_jabar
    const { data, error } = await supabase.from("kabupaten_jabar").select("*");

    if (error) throw error;

    // Ubah hasil query menjadi format GeoJSON
    const geojson = {
      type: "FeatureCollection",
      features: data.map((row) => ({
        type: "Feature",
        geometry: row.geometry,
        properties: {
          OBJECTID: row.objectid,
          PROVINSI: row.provinsi,
          PROVNO: row.provno,
          KABKOTNO: row.kabkotno,
          KABKOT: row.kabkot,
          ID_KAB: row.id_kab,
          Shape_Leng: row.shape_leng,
          Shape_Area: row.shape_area,
        },
      })),
    };

    return NextResponse.json(geojson, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    console.error("❌ API error:", err.message);
    return NextResponse.json(
      { error: "Gagal mengambil data GeoJSON" },
      { status: 500 }
    );
  }
}
