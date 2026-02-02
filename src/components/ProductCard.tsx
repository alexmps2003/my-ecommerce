"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import ProductModal from "./ProductModal";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass group relative overflow-hidden rounded-3xl p-4 transition-all"
    >
      {/* Product Image Container */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white/5">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1 px-2">
        <h3 className="text-lg font-medium text-white/90">{name}</h3>
        <p className="text-sm text-white/50">${(price / 100).toFixed(2)}</p>
      </div>

      {/* Glassy Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 w-full rounded-xl bg-white/10 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black cursor-pointer"
      >
        Add to Cart
      </button>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ id, name, price, image }}
      />
    </motion.div>
  );
}
