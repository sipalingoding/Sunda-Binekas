import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { searchParams } = new URL(req.url);
  const kabupaten = searchParams.get("kabupaten");

  // Konversi format REGIONS ("Kab. Ciamis") ke format DB ("KABUPATEN CIAMIS")
  function toDbFormat(name: string): string {
    const s = name.trim();
    if (s.startsWith("Kab. ")) return "KABUPATEN " + s.slice(5).toUpperCase();
    if (s.startsWith("Kota ")) return "KOTA " + s.slice(5).toUpperCase();
    return s.toUpperCase();
  }

  try {
    let query = supabase.from("dongeng").select("*").eq("status", "approved");

    if (kabupaten) {
      query = query.eq("kabupaten", toDbFormat(kabupaten));
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
