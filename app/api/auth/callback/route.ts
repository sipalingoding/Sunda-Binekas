import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.user) {
      const user = session.user;

      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        await supabase.from("users").insert([{
          id: user.id,
          email: user.email,
          username: user.user_metadata?.full_name ?? "User",
          nohp: "",
        }]);
      }
    }
  }

  return NextResponse.redirect(origin);
}
