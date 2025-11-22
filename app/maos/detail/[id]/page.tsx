import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ApproveButtons from "./button-decision/ButtonDecision";
import { GrView } from "react-icons/gr";
import { FaCamera } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdPlace } from "react-icons/md";
import Image from "next/image";
import ShareDialogButton from "./share-dialog-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ButtonDialog from "./button-dialog-icon";
import MapViewWrapper from "../MapViewWrapper";
import DetailClientWrapper from "./DetailClientWrapper";

export default async function DetailMaosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataId = atob(id);
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
      kecamatan,
      desa,
      eusi,
      view,
      status,
      kamus,
      sumber,
      photo,
      lat,
      lan,
      audio,
      translate,
      created_at,
      user_id ( 
        id,
        username,
        email,
        photo,
        nohp
      )
    `
    )
    .eq("id", dataId)
    .single();

  await supabase
    .from("dongeng")
    .update({ view: (data?.view ?? 0) + 1 })
    .eq("id", dataId);

  if (error) return <div>Error ambil dongeng: {error.message}</div>;

  const openInGoogleMaps = () => {
    if (data?.lat && data?.lan) {
      const url = `https://www.google.com/maps?q=${data.lat},${data.lan}`;
      return url;
    }
    return null;
  };

  const mapsUrl = openInGoogleMaps();

  return (
    <div className="rounded-lg p-4 md:p-8">
      <Card className="p-4 md:p-6 lg:p-8">
        <CardHeader className="flex gap-2 justify-around items-center">
          {data?.photo && (
            <Image
              src={data.photo}
              height={300}
              width={300}
              alt="photo dongeng"
            />
          )}
          <CardTitle className="flex flex-col gap-6 md:gap-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-2xl md:text-3xl font-bold text-balance">
                {data.judul}
              </div>
            </div>

            <div className="text-sm md:text-base font-light flex flex-col">
              <span>Dongeng daerah: {data.kabupaten}</span>
              <span>Sumber: {data?.sumber}</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 md:gap-10">
          <DetailClientWrapper
            eusi={data.eusi}
            translate={data.translate}
            audio={data.audio}
            role={role}
          />

          {/* Kamus & View Count */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            <div className="p-4 border border-black rounded-md flex-1 flex flex-col gap-3">
              <span className="font-semibold text-sm md:text-base">
                Kamus Alit:
              </span>
              {data?.kamus?.length > 0 ? (
                data.kamus.map((item: any, index: number) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <span className="text-sm font-bold">{item.kata} :</span>
                    <span className="text-sm italic">{item.pengertian}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm italic text-gray-500">
                  Tidak ada kamus alit.
                </span>
              )}
            </div>

            <div className="flex justify-end items-center lg:w-1/4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <GrView size={15} color="white" />
                </div>
                <span className="text-sm md:text-base">{data.view}</span>
              </div>
              <ShareDialogButton
                link={`https://sunda-binekas.vercel.app/dongeng/${dataId}`}
              />
            </div>
          </div>

          <MapViewWrapper data={data} />

          <div className="border border-black w-full"></div>

          {/* Kontributor, Hubungi, Tempat */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                {(data.user_id as any).photo ? (
                  <Image
                    src={(data.user_id as any).photo}
                    height={40}
                    width={40}
                    alt="foto_user"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <FaCamera size={18} className="text-white" />
                )}
              </div>
              <span className="text-sm md:text-base">
                Kontributor: {(data.user_id as any).username}
              </span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <IoCall size={15} color="white" />
                  </div>
                  <span className="text-sm md:text-base">
                    Hubungi Kontributor
                  </span>
                </div>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px]  bg-white 
          dark:bg-neutral-900 
          text-black 
          dark:text-white 
          rounded-2xl 
          shadow-lg 
          border border-gray-200"
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Kontak Kontributor
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                    Mangga tiasa ngahubungi kontributor ngangge :
                  </DialogDescription>
                </DialogHeader>

                <ButtonDialog
                  email={(data.user_id as any).email}
                  nohp={(data.user_id as any).nohp}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <a
              href={mapsUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${
                mapsUrl
                  ? "cursor-pointer hover:opacity-80 transition"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <MdPlace size={18} color="white" />
              </div>
              <span className="text-sm md:text-base">
                Nyalusur Tempat Dongeng
              </span>
            </a>
          </div>
        </CardContent>
      </Card>

      {role === "admin" && (
        <div className="mt-6">
          <ApproveButtons id={data.id} isAudio={data.audio ? true : false} />
        </div>
      )}
    </div>
  );
}
