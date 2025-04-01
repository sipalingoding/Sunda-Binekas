import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id, user_metadata } = data.user;
  const email = data?.user?.email ?? "";

  try {
    // Cek apakah user sudah ada
    let user = await prisma.user.findUnique({ where: { email } });

    // Jika belum ada, simpan user baru
    if (!user) {
      user = await prisma.user.create({
        data: {
          id,
          email,
          username: user_metadata.full_name || "User",
          password: "",
          gender: "Not Specified",
        },
      });
    }

    return res.status(200).json({ message: "User logged in", user });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
