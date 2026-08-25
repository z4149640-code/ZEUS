"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductOffer } from "./supabase";

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

// ─── Bundle Pricing Helpers (exported for use in CartDrawer & ProductClient) ───

/**
 * Given a list of offers and a total quantity, returns the single best
 * applicable offer (highest threshold that is <= totalQty), or null.
 */
export function getBestOffer(
  offers: ProductOffer[] | undefined | null,
  totalQty: number
): ProductOffer | null {
  if (!offers || offers.length === 0) return null;
  const sorted = [...offers].sort((a, b) => b.quantity - a.quantity);
  return sorted.find((o) => totalQty >= o.quantity) ?? null;
}

/**
 * Returns the original and effective line price for a single CartItem,
 * taking into account ALL items of the same product in the cart
 * (grouped by product.id across all colors/sizes per the client's spec).
 */
export function getItemLinePrice(
  item: CartItem,
  allItems: CartItem[]
): {
  original: number;
  effective: number;
  offerApplied: boolean;
  offer: ProductOffer | null;
} {
  const productItems = allItems.filter((i) => i.product.id === item.product.id);
  const totalProductQty = productItems.reduce((s, i) => s + i.quantity, 0);
  const product = item.product;
  const offer = getBestOffer(product.offers, totalProductQty);

  const original = item.quantity * product.price;

  if (!offer) {
    return { original, effective: original, offerApplied: false, offer: null };
  }

  // Effective cost for the entire product group
  const bundles = Math.floor(totalProductQty / offer.quantity);
  const remainder = totalProductQty % offer.quantity;
  const totalEffective = bundles * offer.price + remainder * product.price;

  // Proportional share for this particular line item
  const itemProportion = item.quantity / totalProductQty;
  const effective = Math.round(totalEffective * itemProportion);

  return { original, effective, offerApplied: true, offer };
}

// ─── Store ────────────────────────────────────────────────────────────────────

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

        const variant = product.variants.find(v => v.colorName === color);
        const maxQty = variant?.quantities?.[size] !== undefined ? variant.quantities[size] : Infinity;

        if (existing) {
          if (existing.quantity >= maxQty) return;
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          if (maxQty <= 0) return;
          set({ items: [...items, { product, size, color, quantity: 1 }] });
        }
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

        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === productId && i.size === size && i.color === color
        );

        if (existing) {
          const variant = existing.product.variants.find(v => v.colorName === color);
          const maxQty = variant?.quantities?.[size] !== undefined ? variant.quantities[size] : Infinity;
          const finalQty = Math.min(quantity, maxQty);

          set({
            items: items.map((i) =>
              i.product.id === productId && i.size === size && i.color === color
                ? { ...i, quantity: finalQty }
                : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      /**
       * Groups items by product.id; applies the best bundle offer per group.
       * e.g. 1× Black L + 1× White M of the same product both count toward
       * the "Buy 2 for 700" threshold.
       */
      totalPrice: () => {
        const items = get().items;

        // Group by product.id
        const groups = new Map<string, CartItem[]>();
        for (const item of items) {
          const g = groups.get(item.product.id) ?? [];
          g.push(item);
          groups.set(item.product.id, g);
        }

        let total = 0;
        for (const groupItems of Array.from(groups.values())) {
          const product = groupItems[0].product;
          const totalQty = groupItems.reduce((s: number, i: CartItem) => s + i.quantity, 0);
          const offer = getBestOffer(product.offers, totalQty);

          if (offer) {
            const bundles = Math.floor(totalQty / offer.quantity);
            const remainder = totalQty % offer.quantity;
            total += bundles * offer.price + remainder * product.price;
          } else {
            total += totalQty * product.price;
          }
        }
        return total;
      },
    }),
    { name: "zeus-cart" }
  )
);
