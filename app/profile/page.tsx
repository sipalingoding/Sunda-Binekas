import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import ClientProfile from "./clientProfile";
import { getSession } from "../api/auth/session/route";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await getSession();

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
