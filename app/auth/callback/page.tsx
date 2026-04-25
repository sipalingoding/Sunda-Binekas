"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

async function ensureUserProfile(supabase: ReturnType<typeof createClientComponentClient>, user: { id: string; email?: string; user_metadata?: { full_name?: string } }) {
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

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientComponentClient();

    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && session?.user) {
            await ensureUserProfile(supabase, session.user);
            router.replace("/");
            return;
          }
        } catch {
          // fall through to session check
        }
      }

      // Implicit flow fallback: session already set via hash fragment
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await ensureUserProfile(supabase, session.user);
        router.replace("/");
        return;
      }

      // Listen for auth state change (covers delayed token arrival)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            await ensureUserProfile(supabase, session.user);
            router.replace("/");
          }
        }
      );

      return () => subscription.unsubscribe();
    }

    handleCallback();
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
