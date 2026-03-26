// /app/api/dongeng/by-wilayah/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { kabupaten, kecamatan, desa } = await request.json();

    // 🔹 Query filter dinamis
    let query = supabase.from("ngupingkeun_list").select("*");

    if (kabupaten)
      query = query.ilike("dongeng_id.kabupaten", `%${kabupaten}%`);
    if (kecamatan)
      query = query.ilike("dongeng_id.kecamatan", `%${kecamatan}%`);
    if (desa) query = query.ilike("dongeng_id.desa", `%${desa}%`);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Error get dongeng:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data dongeng." },
      { status: 500 }
    );
  }
}
