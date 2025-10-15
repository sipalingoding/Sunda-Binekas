import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();
    const { dongeng_id, isi } = body;

    // Validasi input
    if (!dongeng_id || !isi) {
      return NextResponse.json(
        { error: "dongeng_id dan isi komentar wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil user login dari Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "User belum login" }, { status: 401 });
    }

    // Insert komentar
    const { data, error } = await supabase.from("komentar").insert([
      {
        dongeng_id,
        isi,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Komentar berhasil ditambahkan",
      data,
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dongeng_id = searchParams.get("dongeng_id");

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from("komentar")
    .select(
      `
      id,
      isi,
      created_at,
      user_id,
      user:user_id (
        id,
        username,
        email
      )
    `
    )
    .eq("dongeng_id", dongeng_id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
