"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const supabase = createClientComponentClient();

      // Ambil session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error("OAuth error:", sessionError);
        return;
      }

      const user = sessionData.session.user;

      // Cek apakah user sudah ada di table 'user'
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Jika belum ada, simpan user ke database
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              email: user.email,
              username: user.user_metadata?.full_name ?? "User",
              gender: "",
            },
          ]);

        if (insertError) {
          console.error("Error saving user:", insertError);
        }
      }
      router.push("/");
    };

    handleOAuthCallback();
  }, [router]);
}
