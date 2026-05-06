import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, context: any) {
  const { id } = context.params;
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized - user not logged in" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("ngupingkeun_list")
      .update({ status: "approved" })
      .eq("id", Number(id))
      .select();

    if (error) {
      console.error("Gagal update status:", error);
      return NextResponse.json({ error: "Gagal mengubah status" }, { status: 500 });
    }

    return NextResponse.json({ message: "Status berhasil diubah menjadi approved", data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
