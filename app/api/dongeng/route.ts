import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const body = await req.json();

  console.log(body);

  const { kabupaten, kecamatan, desa, judul, eusi, lat, lan, kamus, sumber, kabupaten_id, kecamatan_id, desa_id, photo } = body;

  const { data, error } = await supabase
    .from("dongeng")
    .insert([{ user_id: user?.id, kabupaten, kecamatan, desa, judul, eusi, lat, lan, kamus, sumber, kabupaten_id, kecamatan_id, desa_id, photo }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Lokasi berhasil disimpan", data });
}

export async function GET() {
  const supabase = await createClient();

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
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("dongeng")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 500 });
    }

    return NextResponse.json({ message: `Status dongeng dengan id ${id} berhasil diubah menjadi 'approved'` });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
