import { createClient } from "@/utils/supabase/server";
import CartItem from "@/components/CartItem";
import { redirect } from "next/navigation";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch joined data
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(`id, quantity, products(name, price, image)`)
    .eq("user_id", user.id);

  const subtotal = cartItems?.reduce((acc, item: any) => acc + (item.products.price * item.quantity), 0) || 0;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">My Cart</h1>
      <div className="space-y-4">
        {cartItems?.map((item: any) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="text-right">
            <p className="text-sm text-white/50">Total: <span className="text-white text-lg font-bold">Rs. {(subtotal / 100).toLocaleString()}</span></p>
          </div>
          <button className="bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-700 transition">
            Check Out ({cartItems?.length || 0})
          </button>
        </div>
      </div>
    </div>
  );
}