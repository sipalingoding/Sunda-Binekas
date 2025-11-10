import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: any) {
  const { id } = context.params;
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { error } = await supabase
      .from("dongeng")
      .update({ status_audio: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Gagal memperbarui status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Status audio dongeng dengan id ${id} berhasil diubah menjadi 'approved'`,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
