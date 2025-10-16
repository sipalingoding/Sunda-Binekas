import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Pastikan user login (opsional)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - user not logged in" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("dongeng")
      .update({ status: "rejected" })
      .eq("id", id.trim())
      .select();

    if (error) {
      console.error("Gagal update status:", error);
      return NextResponse.json(
        { error: "Gagal mengubah status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Status berhasil diubah menjadi approved",
      data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
