import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const id = context.params.id; // ambil id dari context

  try {
    const { data, error } = await supabase
      .from("playlist")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Playlist dihapus",
      data,
    });
  } catch (err: any) {
    console.error("❌ Error delete playlist:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
