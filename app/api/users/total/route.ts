import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // 1️⃣ Total user
    const { count: totalUsers, error: userError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    if (userError) throw userError;

    // 2️⃣ Total dongeng
    const { count: totalDongeng, error: dongengError } = await supabase
      .from("dongeng")
      .select("*", { count: "exact", head: true });
    if (dongengError) throw dongengError;

    // 3️⃣ Ambil semua user_id dari tabel dongeng, lalu ambil yang unik
    const { data: dongengUsers, error: contributorError } = await supabase
      .from("dongeng")
      .select("user_id");
    if (contributorError) throw contributorError;

    const uniqueUserIds = dongengUsers
      ? [...new Set(dongengUsers.map((d) => d.user_id))]
      : [];
    const totalContributors = uniqueUserIds.length;

    // 4️⃣ Hitung total view
    const { data: viewData, error: viewError } = await supabase
      .from("dongeng")
      .select("view");
    if (viewError) throw viewError;

    const totalViews =
      viewData?.reduce((sum, item) => sum + (item.view || 0), 0) || 0;

    // ✅ Return hasil
    return NextResponse.json({
      total_users: totalUsers || 0,
      total_dongeng: totalDongeng || 0,
      total_kontributor: totalContributors,
      total_view: totalViews,
    });
  } catch (err) {
    console.error("Error di /api/statistics:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil statistik" },
      { status: 500 }
    );
  }
}
