import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import UserNav from "./UserNav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch the exact count from Supabase
  let cartCount = 0;
  let isAdmin = false;

  if (user) {
    // Fetch Cart Count
    const { count } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    cartCount = count ?? 0;

    // Fetch Admin Status
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4 backdrop-blur-xl">
      <Link href="/" className="text-xl font-bold text-white">
        Storefront
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/cart" className="relative group p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-white group-hover:text-blue-400 transition"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>

          {/* Real-time Count Badge */}
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Pass data to the Client Component */}
        <UserNav initialUser={user} isAdmin={isAdmin} />
      </div>
    </nav>
  );
}
