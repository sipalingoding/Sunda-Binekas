import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("playlist")
    .select(
      `id, 
      dongeng_id (
        id,
        judul,
        eusi,
        photo,
        audio
      )`
    )
    .eq("user_id", user.id)
    .order("id", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Ambil data dari body request
    const { dongeng_id } = await req.json();

    if (!dongeng_id) {
      return NextResponse.json(
        { error: "dongeng_id is required" },
        { status: 400 }
      );
    }

    // Ambil user login dari session Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tambahkan playlist baru
    const { data, error } = await supabase
      .from("playlist")
      .insert([
        {
          user_id: user.id,
          dongeng_id,
        },
      ])
      .select(); // optional: biar langsung return data yang baru dibuat

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Playlist added successfully", data },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
