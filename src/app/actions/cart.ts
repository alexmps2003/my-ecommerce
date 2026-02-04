"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Please log in to add items to cart");

  // Upsert pattern: Update quantity if it exists, otherwise insert
  const { error } = await supabase
    .from("cart_items")
    .upsert(
      { user_id: user.id, product_id: productId, quantity },
      { onConflict: 'user_id, product_id' }
    );

  if (error) throw error;
  revalidatePath("/cart");
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient();
  await supabase.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/cart");
}

export async function updateCartQuantity(itemId: string, newQuantity: number) {
  if (newQuantity < 1) return;
  const supabase = await createClient();
  await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId);
  revalidatePath("/cart");
}