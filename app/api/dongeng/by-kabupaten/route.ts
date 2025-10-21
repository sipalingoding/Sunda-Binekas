import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Buat response awal agar bisa dipakai oleh Supabase client
  const res = NextResponse.next();

  // Buat Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Ambil query params dari URL
  const { searchParams } = new URL(req.url);
  const kabupaten = searchParams.get("kabupaten");

  try {
    let query = supabase.from("dongeng").select("*").eq("status", "approved");

    // Jika ada filter kabupaten, tambahkan where clause
    if (kabupaten) {
      query = query.eq("kabupaten", kabupaten);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Gagal mengambil data dongeng",
      },
      { status: 500 }
    );
  }
}
