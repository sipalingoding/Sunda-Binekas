import { createClient } from "@/lib/supabase/server";
import SumbanganForm from "./sumbanganForm";

export default async function SumbanganPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  return <SumbanganForm />;
}
