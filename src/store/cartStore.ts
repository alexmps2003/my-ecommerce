import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        console.log("Store received item:", item);
        set((state) => {
          console.log("Store: current items in cart:", state.items.length);
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            console.log("Store: Found duplicate, increasing quantity");
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          console.log("Store: Adding new item to array");

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
    }),
    {
      name: "shopping-cart",
    },
  ),
);
