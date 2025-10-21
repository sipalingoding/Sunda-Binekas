import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ProfileFormClient from "./profile-form/ProfileFormClient";

const ProfilePage = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dataUser: any = [];

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    dataUser = userData;
  }

  return (
    <div className="rounded-lg p-16 flex flex-col justify-start items-start gap-6">
      <span className="font-bold text-2xl mb-4">Edit Profile</span>

      <ProfileFormClient userData={dataUser} />
    </div>
  );
};

export default ProfilePage;
