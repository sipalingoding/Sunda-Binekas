import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, context: RouteContext) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = context.params;

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
