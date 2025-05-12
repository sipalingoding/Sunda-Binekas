import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profileForm"; // kita buat di bawah

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <div>Silakan login terlebih dahulu.</div>;
  }

  const { data: user, error } = await supabase
    .from("user")
    .select("id, username, email, gender")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
    return <div>Gagal mengambil data user.</div>;
  }

  return <ProfileForm user={user} />;
}
