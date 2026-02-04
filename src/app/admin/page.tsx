"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { updateProduct } from "@/app/actions/products";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Inside your Admin component
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // A helper to clear the form back to "Add Mode"
  const resetForm = () => setSelectedProduct(null);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateProduct(formData);
      setEditingProduct(null); // Close edit mode on success
      alert("Product updated successfully!");
    } catch (err) {
      alert("Failed to update product.");
    }
  };

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
    };

    if (isAuthorized) {
      fetchProducts();
    }
  }, [isAuthorized, supabase]);

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

          <form
            key={selectedProduct?.id || "new"}
            action={updateProduct}
            className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <h2 className="text-xl font-semibold">
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </h2>

            {/* IMPORTANT: Hidden ID field for the database query */}
            {selectedProduct && (
              <input type="hidden" name="id" value={selectedProduct.id} />
            )}

            <div>
              <label className="block text-sm text-white/50 mb-1">
                Product Name
              </label>
              <input
                name="name"
                defaultValue={selectedProduct?.name || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1">
                Price (in cents)
              </label>
              <input
                name="price"
                type="number"
                defaultValue={selectedProduct?.price || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1">
                Image URL
              </label>
              <input
                name="image"
                defaultValue={selectedProduct?.image || ""}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition"
              >
                {selectedProduct ? "Update Product" : "Save Product"}
              </button>

              {selectedProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-12 space-y-4">
          <h3 className="text-lg font-medium text-white/50">
            Current Inventory
          </h3>
          {products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-white/40">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
