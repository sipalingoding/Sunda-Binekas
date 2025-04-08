import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import ClientProfile from "./clientProfile";
import { createClient } from "@/lib/supabase/server";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ClientProfile user={user} />;
}
