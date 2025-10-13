import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // ✅ Halaman publik (tidak perlu login)
  const publicPaths = ["/login", "/register", "/public", "/api"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // ✅ Jika bukan halaman publik & belum login → redirect ke /login
  if (!isPublicPath && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|login|register).*)"],
};
