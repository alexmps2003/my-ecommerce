"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user || user.email !== "alexsh4ndev@gmail.com") {
        router.push("/");
      } else {
        setIsAuthorized(true);
      }
    };

    checkUser();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Convert price to cents (assuming input is in dollars/units)
    const priceInCents = Math.round(parseFloat(price) * 100);

    const { error: insertError } = await supabase.from("products").insert([
      {
        name,
        price: priceInCents,
        description,
        image: imageUrl, // Mapping image_url input to 'image' column based on previous ProductCard usage
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setMessage("Product added successfully!");
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setImageUrl("");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return null; // Don't render anything while checking or redirecting
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-lg rounded-2xl p-8"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Admin Dashboard
        </h1>
        <p className="mb-8 text-center text-white/60">
          Add a new product to the store
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Price (in dollars)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="e.g. 99.99"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="Product description..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-blue-500 focus:bg-white/10"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
