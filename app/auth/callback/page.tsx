"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientComponentClient();

    // Tangani SIGNED_IN — ini yang dipakai ketika OAuth baru selesai
    // Supabase JS client otomatis deteksi ?code= atau #access_token= dari URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
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

          router.replace("/");
        }
      }
    );

    // Fallback: user sudah punya session (misal halaman di-refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "var(--paper)",
    }}>
      <div style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "3px solid var(--sb-line)",
          borderTopColor: "var(--terracotta)",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }} />
        <div style={{
          fontFamily: "var(--font-caveat)",
          fontSize: 20,
          color: "var(--terracotta)",
        }}>
          Keur asup…
        </div>
        <div style={{ fontSize: 13, color: "var(--sb-muted)" }}>
          Sakedap deui anjeun bakal dialihkeun.
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
