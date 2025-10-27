import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import FormEditPage from "./FormEditPage";

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("dongeng")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return <div className="p-6 text-red-500">Gagal memuat data</div>;
  }

  return <FormEditPage dataGet={data} />;
}
