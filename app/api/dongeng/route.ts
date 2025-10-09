// app/api/lokasi/route.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const body = await req.json();
  const { kabupaten, kecamatan, desa, judul, eusi, lat, lan } = body;

  // Pastikan user sudah login
  // const {
  //   data: { user },
  //   error: getUserError,
  // } = await supabase.auth.getUser();

  // if (getUserError || !user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // Simpan data ke tabel "lokasi"
  const { data, error } = await supabase
    .from("dongeng")
    .insert([
      {
        // user_id: user.id,
        kabupaten,
        kecamatan,
        desa,
        judul,
        eusi,
        lat,
        lan,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Lokasi berhasil disimpan", data });
}

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // const {
  //   data: { user },
  //   error: getUserError,
  // } = await supabase.auth.getUser();

  // if (getUserError || !user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const { data, error } = await supabase
    .from("dongeng")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
