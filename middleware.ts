import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 🔹 Buat Supabase middleware client
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const protectedPaths = ["/nyerat", "/ngadeklamasikeun", "/profile", "/admin"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 🔒 Kalau bukan halaman publik & belum login → redirect ke /login
  if (isProtectedPath && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ Cek halaman admin
  if (pathname.startsWith("/admin") && session?.user?.id) {
    // Ambil data role dari table "user"
    const { data: userRole } = await supabase
      .from("users")
      .select("role")
      .eq("id", session?.user.id)
      .single();

    if (userRole?.role !== "admin") {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 🔁 Kembalikan response (biar session tersimpan di cookies)
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|login|register|public|auth/callback).*)",
  ],
};
