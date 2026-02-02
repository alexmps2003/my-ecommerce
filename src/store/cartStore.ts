import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        const quantityToAdd = item.quantity || 1;

        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color,
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + quantityToAdd }
                  : i,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: quantityToAdd }],
          };
        });
      },
    }),
    {
      name: "shopping-cart",
    },
  ),
);
