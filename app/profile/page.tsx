import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProfileFormClient from "./profile-form/ProfileFormClient";

const ProfilePage = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  let dataUser: any = null;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    dataUser = userData;
  }

  return <ProfileFormClient userData={dataUser} />;
};

export default ProfilePage;
