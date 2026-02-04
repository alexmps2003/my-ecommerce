"use client";

import { removeFromCart, updateCartQuantity } from "@/app/actions/cart";

export default function CartItem({ item }: { item: any }) {
  return (
    <div className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
      <img src={item.products.image} className="w-20 h-20 rounded-xl object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-medium">{item.products.name}</h3>
          <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-500">🗑️</button>
        </div>
        <p className="text-orange-500 font-bold">Rs. {(item.products.price / 100).toLocaleString()}</p>
        
        <div className="flex justify-end mt-2">
          <div className="flex items-center bg-white/10 rounded-lg border border-white/10 text-white">
            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
            <span className="px-3">{item.quantity}</span>
            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}