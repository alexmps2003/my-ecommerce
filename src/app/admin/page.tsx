"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("Auth Error:", authError);
          router.push("/");
          return;
        }

        // Fetch user role from profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError || profile?.role !== "admin") {
          console.error("Access Denied: User is not an admin.", {
            role: profile?.role,
            error: profileError,
          });
          router.push("/");
          return;
        }

        setIsAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // Convert price to cents
    const priceInCents = Math.round(parseFloat(formData.price) * 100);

    const { error } = await supabase.from("products").insert([
      {
        name: formData.name,
        price: priceInCents,
        description: formData.description,
        image: formData.imageUrl,
      },
    ]);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Product Added Successfully!" });
      setFormData({ name: "", price: "", description: "", imageUrl: "" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-xl font-medium animate-pulse">
            Verifying Permissions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 p-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="mt-2 text-white/60">Admin Dashboard</p>
        </header>

        <div className="glass rounded-3xl p-8">
          <h2 className="mb-6 text-xl font-semibold">Add New Product</h2>

          {message && (
            <div
              className={`mb-6 rounded-xl border p-4 text-center text-sm ${
                message.type === "success"
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Product Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">
                  Price ($)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Image URL
              </label>
              <input
                name="imageUrl"
                type="url"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                placeholder="Product details..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-white py-4 font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Product"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
