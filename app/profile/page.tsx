import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileFormClient from "./profile-form/ProfileFormClient";

const ProfilePage = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const dataUser = userData ?? {
    id: user.id,
    username: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "",
    email: user.email ?? "",
    nohp: "",
    photo: user.user_metadata?.avatar_url ?? "",
    alamat: "",
    pekerjaan: "",
    umur: 0,
  };

  return <ProfileFormClient userData={dataUser} />;
};

export default ProfilePage;
