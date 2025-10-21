import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ApproveButtons from "./button-decision/ButtonDecision";
import { GrView } from "react-icons/gr";
import { ImVolumeHigh } from "react-icons/im";
import { FaCamera } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdPlace } from "react-icons/md";

export default async function DetailMaosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    role = userData?.role ?? null;
  }

  const { data, error } = await supabase
    .from("dongeng")
    .select(
      `
    id,
    judul,
    kabupaten,
    eusi,
    view,
    status,
    kamus,
    sumber,
    created_at,
    user_id ( 
      id,
      username,
      email
    )
  `
    )
    .eq("id", id)
    .single();

  await supabase
    .from("dongeng")
    .update({ view: (data?.view ?? 0) + 1 })
    .eq("id", id);

  if (error) console.error("Error ambil dongeng:", error);
  else console.log("Data dongeng:", data);

  if (error) {
    return <div>Error ambil dongeng: {error.message}</div>;
  }

  return (
    <div className="rounded-lg p-8">
      <Card className="p-4 h-fit">
        <CardHeader>
          <CardTitle className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{data.judul}</div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <ImVolumeHigh size={15} color="white" />
              </div>
            </div>

            <div className="text-sm font-light flex flex-col">
              <span>Dongeng daerah : {data.kabupaten}</span>
              <span>Sumber : {data?.sumber}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-10">
          <span>{data.eusi}</span>
          <div className="flex gap-20">
            <div className="p-4 w-3/4 border border-black rounded-md min-h-36 flex flex-col gap-2">
              <span>Kamus Alit :</span>
              {data?.kamus?.map((item: any, index: number) => (
                <div className="flex gap-2 items-center" key={index}>
                  <span className="text-sm font-bold">{item.kata} :</span>
                  <span className="text-sm italic">{item.pengertian}</span>
                </div>
              ))}
            </div>
            <div className="w-1/4 flex gap-2 justify-end items-end">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <GrView size={15} color="white" />
                </div>
                <span>{data.view}</span>
              </div>
            </div>
          </div>
          <div className="border border-black w-full"></div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <FaCamera size={15} color="white" />
              </div>
              <span>Kontributor : {(data.user_id as any).username}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <IoCall size={15} color="white" />
              </div>
              <span>Hubungi Kontributor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <MdPlace size={18} color="white" />
              </div>
              <span>Nyalusur Tempat Dongeng</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {role === "admin" && data.status == "pending" && (
        <ApproveButtons id={data.id} />
      )}
    </div>
  );
}
