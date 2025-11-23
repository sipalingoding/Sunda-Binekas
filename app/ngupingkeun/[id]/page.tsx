import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaCamera } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import Image from "next/image";
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
import SafeHTMLContent from "@/app/maos/detail/[id]/safe-html/SafeHtml";
import ApproveButtonsNgupingkeun from "./ButtonDecisionNgupingkeun";
import ButtonDialog from "@/app/maos/detail/[id]/button-dialog-icon";

export default async function DetailMaosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataId = atob(id);
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("ngupingkeun_list")
    .select(
      `id, 
    dongeng_id (
      id,
      judul,
      eusi,
      photo,
      audio,
      kabupaten,
      sumber
    ), status, file_audio, user_id (
      photo, username
    )`
    )
    .eq("id", dataId)
    .single();

  if (error) return <div>Error ambil dongeng: {error.message}</div>;

  return (
    <div className="rounded-lg p-4 md:p-8">
      <Card className="p-4 md:p-6 lg:p-8">
        <CardHeader className="flex gap-2 justify-around items-center">
          {(data.dongeng_id as any).photo && (
            <Image
              src={(data.dongeng_id as any).photo}
              height={300}
              width={300}
              alt="photo dongeng"
            />
          )}
          <CardTitle className="flex flex-col gap-6 md:gap-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-2xl md:text-3xl font-bold text-balance">
                {(data.dongeng_id as any).judul}
              </div>
            </div>

            <div className="text-sm md:text-base font-light flex flex-col">
              <span>Dongeng daerah: {(data.dongeng_id as any).kabupaten}</span>
              <span>Sumber: {(data.dongeng_id as any).sumber}</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 md:gap-10">
          <SafeHTMLContent html={(data.dongeng_id as any).eusi} />
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
          </div>
        </CardContent>
      </Card>
      <div className="mt-6">
        <ApproveButtonsNgupingkeun id={data.id} />
      </div>
    </div>
  );
}
