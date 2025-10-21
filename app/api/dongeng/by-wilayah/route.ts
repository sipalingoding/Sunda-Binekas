// /app/api/dongeng/by-wilayah/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { kecamatan, desa } = await request.json();

    if (!kecamatan && !desa) {
      return NextResponse.json(
        { error: "Kecamatan atau desa harus diisi." },
        { status: 400 }
      );
    }

    // 🔹 Query filter dinamis
    let query = supabase.from("dongeng").select("*");

    if (kecamatan) query = query.ilike("kecamatan", `%${kecamatan}%`);
    if (desa) query = query.ilike("desa", `%${desa}%`);

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
