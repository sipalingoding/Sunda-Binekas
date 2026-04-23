import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Tukar code dengan session — wajib untuk PKCE flow
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      // Simpan user ke tabel jika belum ada
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.full_name ?? "User",
          },
        ]);
      }
    }
  }

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
