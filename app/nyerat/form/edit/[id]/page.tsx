import { createClient } from "@/lib/supabase/server";
import FormEditPage from "./FormEditPage";

export default async function EditPage({
  params,
}: {
  params: any; // ✅ bypass type error
}) {
  const resolvedParams = await params; // ✅ handle Promise or object safely
  const { id } = resolvedParams;

  const supabase = await createClient();

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
