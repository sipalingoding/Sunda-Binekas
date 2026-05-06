import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("dongeng")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from("dongeng").getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
