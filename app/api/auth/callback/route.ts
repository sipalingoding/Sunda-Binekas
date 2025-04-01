import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Ambil user dari Supabase
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, user_metadata } = data.user;
  const email = data?.user?.email ?? "";

  try {
    // Cek apakah user sudah ada di database
    let user = await prisma.user.findUnique({ where: { email } });

    // Jika user belum ada, buat user baru
    if (!user) {
      user = await prisma.user.create({
        data: {
          id,
          email,
          username: user_metadata.full_name || "User",
          password: "",
          gender: "Not Specified",
        },
      });
    }

    return NextResponse.json(
      { message: "User logged in", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
