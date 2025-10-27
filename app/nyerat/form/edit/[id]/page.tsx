import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import FormEditPage from "./FormEditPage";

export default async function EditPage({
  params,
}: {
  params: any; // ✅ bypass type error
}) {
  const resolvedParams = await params; // ✅ handle Promise or object safely
  const { id } = resolvedParams;

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
