import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Autentikasi user dengan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const cookieStore = await cookies(); // ✅ await di sini
    cookieStore.set("sb-access-token", data.session.access_token);
    cookieStore.set("sb-refresh-token", data.session.refresh_token);

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: data.user,
        token: data.session?.access_token,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
