import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log(req);
  try {
    const body = await req.json();
    const { email, password, username, gender } = body;

    if (!email || !password || !username || !gender) {
      return NextResponse.json(
        { error: "Semua field harus diisi!" },
        { status: 400 }
      );
    }

    // ✅ Cek apakah email sudah ada di database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // ✅ Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Daftarkan user ke Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, gender },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // ✅ Simpan user ke database Prisma
    await prisma.user.create({
      data: {
        email,
        username,
        gender,
        password: hashedPassword, // Simpan password yang sudah di-hash
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
