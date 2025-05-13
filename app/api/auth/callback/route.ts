// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Ambil session setelah redirect dari Google OAuth
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error("Gagal mendapatkan session:", error);
        router.push("/login"); // Redirect jika terjadi error
      } else {
        // Session ditemukan, user berhasil login
        router.push("/profile"); // Redirect ke halaman profil atau halaman tujuan lainnya
      }
    };

    handleAuth();
  }, [router]);
}
