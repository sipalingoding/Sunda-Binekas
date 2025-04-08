import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createClient = async () => {
  const cookieStore = await cookies(); // ✅ pakai await sekarang
  const headerList = await headers(); // ini masih bisa sync

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: () => {}, // optional
        delete: () => {}, // optional
      },
      headers: Object.fromEntries(headerList.entries()),
    }
  );
};
