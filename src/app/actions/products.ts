"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveProduct(formData: FormData) {
  const supabase = await createClient();

  // Extract data from form
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = parseInt(formData.get("price") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  // PROFESSIONAL PATTERN: If ID is null or "null", we INSERT. Otherwise, we UPDATE.
  if (!id || id === "null") {
    const { error } = await supabase
      .from("products")
      .insert([{ name, price, description, image }]);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("products")
      .update({ name, price, description, image })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

// Keep the old function name for backward compatibility
export async function updateProduct(formData: FormData) {
  return saveProduct(formData);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  // Revalidate both the public storefront and the admin dashboard
  revalidatePath("/");
  revalidatePath("/admin");
}
