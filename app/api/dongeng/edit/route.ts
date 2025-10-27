import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const body = await req.json();
  const {
    id,
    kabupaten,
    kecamatan,
    desa,
    judul,
    eusi,
    lat,
    lan,
    kamus,
    sumber,
    kabupaten_id,
    kecamatan_id,
    desa_id,
    photo,
  } = body;

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: userError } = await supabase
    .from("dongeng")
    .update({
      kabupaten,
      kecamatan,
      desa,
      judul,
      eusi,
      lat,
      lan,
      kamus,
      sumber,
      kabupaten_id,
      kecamatan_id,
      desa_id,
      photo,
    })
    .eq("id", id);

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Berhasil update dongeng" });
}
