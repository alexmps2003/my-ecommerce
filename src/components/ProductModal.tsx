"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { addToCart } from "@/app/actions/cart";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
  } | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
}: ProductModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    try {
      await addToCart(String(product.id), quantity); // This sends data to Supabase
      alert("Added to cart!");
      onClose();
    } catch (err) {
      alert("Failed to add to cart. Make sure you are logged in.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {product.name}
                  </h3>
                  <p className="text-lg text-white/60">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-xl bg-white py-3 text-sm font-bold text-black hover:bg-white/90"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
