"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./supabase";

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  isCheckoutMode: boolean;
  setCheckoutMode: (mode: boolean) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckoutMode: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setCheckoutMode: (mode) => set({ isCheckoutMode: mode }),

      addItem: (product, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, size, color, quantity: 1 }] });
        }
        set({ isOpen: true });
      },

      removeItem: (productId, size, color) =>
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.size === size && i.color === color)
          ),
        }),

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),
    }),
    { name: "zeus-cart" }
  )
);
