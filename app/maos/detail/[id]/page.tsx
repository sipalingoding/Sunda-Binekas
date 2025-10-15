import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import KomentarForm from "./komentar/KomentarForm";

interface Komentar {
  id: string;
  isi: string;
  user_id: string;
  created_at: string;
}

export default async function DetailMaosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ✅ cookies() harus di-await di Next.js 15
  const cookieStore = await cookies();

  // ✅ Client Supabase versi SSR baru
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );

  const { data, error } = await supabase
    .from("dongeng")
    .select(
      `
    id,
    judul,
    eusi,
    created_at,
    user_id ( 
      id,
      username,
      email,
      gender
    )
  `
    )
    .eq("id", id)
    .single();

  if (error) console.error("Error ambil dongeng:", error);
  else console.log("Data dongeng:", data);

  if (error) {
    return <div>Error ambil dongeng: {error.message}</div>;
  }

  return (
    <div className="bg-[#abd7d3] h-[700px] rounded-lg p-8 flex flex-col gap-8 w-[1300px] absolute left-48 top-28 z-20">
      <Tabs defaultValue="carita">
        <TabsList>
          <TabsTrigger value="carita">Carita</TabsTrigger>
          <TabsTrigger value="penulis">Penulis</TabsTrigger>
          <TabsTrigger value="komentar">Komentar</TabsTrigger>
        </TabsList>
        <TabsContent value="carita">
          <Card>
            <CardHeader>
              <CardTitle>
                <div>{data.judul}</div>
              </CardTitle>
              {/* <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6">{data.eusi}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="penulis">
          <Card>
            <CardHeader>
              <CardTitle>Biodata</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {data && data.user_id ? (
                <div>
                  <p>
                    <strong>Ngaran:</strong> {(data.user_id as any).username}
                  </p>
                  <p>
                    <strong>Email:</strong> {(data.user_id as any).email}
                  </p>
                  <p>
                    <strong>Jenis Kelamin:</strong>{" "}
                    {(data.user_id as any).gender}
                  </p>
                </div>
              ) : (
                <p>Data penulis tidak ditemukan.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="komentar">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Komentar</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <KomentarForm dongengId={data.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
