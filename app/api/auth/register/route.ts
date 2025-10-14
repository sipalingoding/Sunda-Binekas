import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username, gender } = body;

    if (!email || !password || !username || !gender) {
      return NextResponse.json(
        { error: "Semua field harus diisi!" },
        { status: 400 }
      );
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: "Gagal memeriksa email: " + fetchError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // ✅ Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Daftarkan user ke Supabase Auth
    const { error: ErrorSignUp } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, gender },
      },
    });

    if (ErrorSignUp) {
      return NextResponse.json({ error: ErrorSignUp.message }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: user?.id,
          email,
          username,
          gender,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "error" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Registrasi berhasil", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error || "Terjadi kesalahan pada server",
        details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      { status: 500 }
    );
  }
}
