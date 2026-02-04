"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as string;

  const { error } = await supabase
    .from("products")
    .update({ name, price, image })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // This "heals" the cache so the storefront updates immediately
  revalidatePath("/");
  revalidatePath("/admin");
}
