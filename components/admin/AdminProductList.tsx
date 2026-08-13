"use client";

import { Trash2, Edit2 } from "lucide-react";
import type { Product } from "@/lib/supabase";

type Props = {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  isDeleting: boolean;
};

export default function AdminProductList({ products, onDelete, onEdit, isDeleting }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-sm border border-white/10 bg-white/5">
        <p className="font-body text-sm text-white/50">لا توجد منتجات حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-black/40 font-display uppercase tracking-widest text-white/60 text-xs">
          <tr>
            <th className="p-4 font-medium text-right">الصورة</th>
            <th className="p-4 font-medium text-right">الاسم</th>
            <th className="p-4 font-medium text-right">السعر</th>
            <th className="p-4 font-medium text-right">المقاسات</th>
            <th className="p-4 font-medium text-right">الألوان</th>
            <th className="p-4 font-medium text-right">الحالة</th>
            <th className="p-4 font-medium text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-body">
          {products.map((product) => {
            const firstVariant = product.variants?.[0];
            const firstImage = firstVariant?.images?.[0] || (firstVariant as any)?.imageUrl;
            return (
              <tr key={product.id} className="transition-colors hover:bg-white/5">
                <td className="p-4 text-right">
                  <div className="h-12 w-12 overflow-hidden rounded-sm border border-white/10 bg-black">
                    {firstImage ? (
                      <img src={firstImage} alt={product.title} className="h-full w-full object-contain" />
                    ) : (
                      <div className="h-full w-full bg-neutral-900" />
                    )}
                  </div>
                </td>
                <td className="p-4 text-right font-medium text-white">
                  <div className="flex flex-col">
                    <span>{product.title}</span>
                    {product.description && <span className="text-[10px] text-white/40 truncate max-w-[150px]">{product.description}</span>}
                  </div>
                </td>
                <td className="p-4 text-right">{product.price.toLocaleString()} ج.م</td>
                <td className="p-4 text-right text-xs">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {product.sizes?.map(s => {
                      const isOOS = s.endsWith(":OOS");
                      const displaySize = isOOS ? s.replace(":OOS", "") : s;
                      return (
                        <span 
                          key={s} 
                          className={`px-1.5 py-0.5 rounded-sm ${isOOS ? 'bg-red-500/20 text-red-300 line-through' : 'bg-white/10'}`}
                          title={isOOS ? "غير متاح" : "متاح"}
                        >
                          {displaySize}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="p-4 text-right text-xs">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {product.variants?.map(v => (
                      <div key={v.colorName} className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-sm" title={v.colorName}>
                        <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex }} />
                        <span>{v.colorName}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm ${product.is_available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {product.is_available ? 'متاح' : 'غير متاح'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onEdit(product)}
                    className="inline-flex items-center justify-center rounded-sm p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors ml-2"
                    title="تعديل المنتج"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center rounded-sm p-2 text-white/40 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-colors"
                    title="حذف المنتج"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
