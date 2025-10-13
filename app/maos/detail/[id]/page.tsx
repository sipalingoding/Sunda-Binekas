import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    .select("*")
    .eq("id", id)
    .single();

  if (error) return <div>Error: {error.message}</div>;

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
              {/* <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="grid gap-6"></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="komentar">
          <Card>
            <CardHeader>
              <CardTitle>Komentar</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6"></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
