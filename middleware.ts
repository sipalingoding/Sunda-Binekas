// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Pastikan cookies() dipanggil dengan await
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession(); // penting: inject session ke SSR

  return res;
}

export const config = {
  matcher: ["/profile"], // Atau semua route jika perlu
};
