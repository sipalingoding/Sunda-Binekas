// app/api/lokasi/route.ts
import {
  createMiddlewareClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        user_id: user?.id,
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

  const { data, error } = await supabase
    .from("dongeng")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Update status jadi 'approved'
    const { error } = await supabase
      .from("dongeng")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Gagal memperbarui status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Status dongeng dengan id ${id} berhasil diubah menjadi 'approved'`,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
