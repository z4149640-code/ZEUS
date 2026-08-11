"use client";

import { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, X } from "lucide-react";

const variantSchema = z.object({
  colorName: z.string().min(1, "مطلوب"),
  colorHex: z.string().min(4, "مطلوب"),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
});

const productSchema = z.object({
  title: z.string().min(2, "يرجى إدخال اسم المنتج"),
  price: z.number().min(1, "يرجى إدخال السعر"),
  description: z.string().optional(),
  sizes: z.array(z.string()).min(1, "اختر مقاس واحد على الأقل"),
  variants: z.array(variantSchema).min(1, "أضف لون/نسخة واحدة على الأقل"),
  is_available: z.boolean().default(true),
  size_chart_url: z.string().optional(),
  sizeChartFile: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

import { useEffect } from "react";
import type { Product } from "@/lib/supabase";

type Props = {
  onSubmit: (data: ProductFormData) => Promise<boolean>;
  isSubmitting: boolean;
  initialData?: Product | null;
  onCancelEdit?: () => void;
};

export default function AdminProductForm({ onSubmit, isSubmitting, initialData, onCancelEdit }: Props) {
  const [sizeInput, setSizeInput] = useState("");
  const sizeChartFileRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = {
    title: "",
    price: "" as unknown as number,
    description: "",
    is_available: true,
    sizes: [],
    variants: [{ colorName: "", colorHex: "#ffffff", imageFile: null, imageUrl: "" }],
    size_chart_url: "",
    sizeChartFile: null,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        price: initialData.price,
        description: initialData.description || "",
        sizes: initialData.sizes,
        is_available: initialData.is_available,
        variants: initialData.variants.map(v => ({
          ...v,
          imageFile: null
        })),
        size_chart_url: initialData.size_chart_url || "",
        sizeChartFile: null,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });

  const sizes = watch("sizes") || [];

  const addSize = () => {
    const newSize = sizeInput.trim().toUpperCase();
    if (newSize && !sizes.includes(newSize)) {
      setValue("sizes", [...sizes, newSize], { shouldValidate: true });
    }
    setSizeInput("");
  };

  const handleAddSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSize();
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setValue("sizes", sizes.filter((s) => s !== sizeToRemove), { shouldValidate: true });
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset(defaultValues);
      replace(defaultValues.variants);
      setSizeInput("");
    }
  };

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto rounded-sm border border-white/10 bg-[#0a0a0a] shadow-2xl">
      {/* Modal Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-8 py-5">
        <button
          type="button"
          onClick={onCancelEdit}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="font-display text-2xl font-bold uppercase tracking-widest text-white">
          {initialData ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-8 p-8">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Title */}
          <div className="flex flex-col gap-3 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">اسم المنتج *</label>
            <input
              {...register("title")}
              className="w-full bg-black border border-white/10 px-5 py-4 text-lg text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm"
              placeholder="مثال: ZEUS Hoodie"
            />
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          {/* Price */}
          <div className="flex flex-col gap-3 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">السعر (ج.م) *</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full bg-black border border-white/10 px-5 py-4 text-lg text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm"
              placeholder="999"
            />
            {errors.price && <span className="text-red-400 text-xs">{errors.price.message}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3 text-right">
          <label className="font-display text-xs uppercase tracking-widest text-white/60">الوصف</label>
          <textarea
            {...register("description")}
            rows={6}
            className="w-full bg-black border border-white/10 px-5 py-4 text-base text-white focus:border-white/40 outline-none transition-colors resize-y rounded-sm text-right leading-relaxed"
            placeholder="تفاصيل المنتج، الخامة، وأي معلومات إضافية..."
          />
          {errors.description && <span className="text-red-400 text-xs">{errors.description.message}</span>}
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-3 text-right">
          <label className="font-display text-xs uppercase tracking-widest text-white/60">المقاسات المتاحة *</label>
          <div className="flex flex-wrap gap-2 justify-end mb-2">
            {sizes.map((s) => (
              <span key={s} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-sm text-sm font-display uppercase border border-white/5">
                <button type="button" onClick={() => handleRemoveSize(s)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addSize}
              className="bg-white/10 text-white px-6 font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white/20 transition-colors border border-white/10"
            >
              إضافة
            </button>
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={handleAddSize}
              className="flex-1 bg-black border border-white/10 px-5 py-4 text-base text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm min-w-0"
              placeholder="اكتب المقاس (مثال: XL)"
            />
          </div>
          {errors.sizes && <span className="text-red-400 text-xs">{errors.sizes.message}</span>}
        </div>

        {/* Variants Section */}
        <div className="flex flex-col gap-5 text-right mt-4 bg-black/40 p-6 border border-white/5 rounded-sm">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => append({ colorName: "", colorHex: "#ffffff", imageFile: null })}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 sm:py-2 rounded-sm text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10 w-full sm:w-auto"
            >
              <Plus size={16} /> إضافة لون آخر
            </button>
            <label className="font-display text-lg uppercase tracking-widest text-white w-full sm:w-auto text-right">الألوان والصور *</label>
          </div>
          
          <div className="flex flex-col gap-6 mt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-6 bg-[#111] p-6 border border-white/10 rounded-sm relative group">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 left-4 text-white/30 hover:text-red-400 transition-colors bg-black/50 p-2 rounded-full"
                    title="حذف هذا اللون"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Color Name */}
                  <div className="lg:col-span-4 flex flex-col gap-2">
                    <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">اسم اللون</label>
                    <input
                      {...register(`variants.${index}.colorName`)}
                      className="w-full bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/40 text-right rounded-sm"
                      placeholder="مثال: أسود قاتم"
                    />
                    {errors.variants?.[index]?.colorName && <span className="text-red-400 text-xs">{errors.variants[index]?.colorName?.message}</span>}
                  </div>

                  {/* Color Picker */}
                  <div className="lg:col-span-2 flex flex-col gap-2 items-end">
                    <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">الدرجة</label>
                    <div className="relative">
                      <input
                        type="color"
                        {...register(`variants.${index}.colorHex`)}
                        className="w-12 h-12 rounded-sm border-2 border-white/10 cursor-pointer bg-black p-0.5"
                      />
                    </div>
                    {errors.variants?.[index]?.colorHex && <span className="text-red-400 text-xs">{errors.variants[index]?.colorHex?.message}</span>}
                  </div>

                  {/* Image Upload */}
                  <div className="lg:col-span-6 flex flex-col gap-2">
                    <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">صورة المنتج</label>
                    <div className="flex items-center gap-4 bg-black border border-white/10 p-3 rounded-sm">
                      {field.imageUrl && (
                        <div className="shrink-0 relative w-12 h-12 bg-white/5 rounded-sm border border-white/10 overflow-hidden">
                          <img src={field.imageUrl} alt="Current" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        {...register(`variants.${index}.imageFile`)}
                        className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-white/80 transition-all cursor-pointer"
                      />
                    </div>
                    {errors.variants?.[index]?.imageFile && <span className="text-red-400 text-xs">{errors.variants[index]?.imageFile?.message?.toString()}</span>}
                    {!field.imageUrl && !watch(`variants.${index}.imageFile`)?.length && (
                      <span className="text-red-400 text-xs mt-1">مطلوب إرفاق صورة</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.variants && !Array.isArray(errors.variants) && <span className="text-red-400 text-xs mt-2">{errors.variants.message}</span>}
        </div>

        {/* Size Chart Image */}
        <div className="flex flex-col gap-3 text-right">
          <label className="font-display text-xs uppercase tracking-widest text-white/60">صورة دليل المقاسات (Size Chart)</label>
          <div className="flex items-center gap-4 bg-black border border-white/10 p-3 rounded-sm">
            {watch("size_chart_url") ? (
              <div className="shrink-0 relative w-16 h-16 group">
                <div className="w-full h-full bg-white/5 rounded-sm border border-white/10 overflow-hidden">
                  <img src={watch("size_chart_url")} alt="Size Chart Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  title="حذف صورة الكاتالوج"
                  onClick={() => {
                    setValue("size_chart_url", "", { shouldValidate: true });
                    setValue("sizeChartFile", null, { shouldValidate: true });
                    if (sizeChartFileRef.current) sizeChartFileRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="shrink-0 w-16 h-16 bg-white/5 rounded-sm border border-dashed border-white/20 flex items-center justify-center">
                <span className="text-white/20 text-[9px] uppercase tracking-widest font-display text-center leading-tight">No<br/>Image</span>
              </div>
            )}
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="file"
                accept="image/*"
                {...register("sizeChartFile")}
                ref={(e) => {
                  register("sizeChartFile").ref(e);
                  sizeChartFileRef.current = e;
                }}
                className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
              />
              {watch("size_chart_url") && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("size_chart_url", "", { shouldValidate: true });
                    setValue("sizeChartFile", null, { shouldValidate: true });
                    if (sizeChartFileRef.current) sizeChartFileRef.current.value = "";
                  }}
                  className="self-start text-[11px] text-red-400/80 hover:text-red-400 underline transition-colors font-display uppercase tracking-widest"
                >
                  × مسح الكاتالوج
                </button>
              )}
            </div>
          </div>
          <p className="text-white/30 text-xs text-right">اختياري — ارفع صورة كاتالوج المقاسات الخاصة بهذا المنتج</p>
        </div>

        {/* Is Available */}
        <div className="flex items-center gap-4 justify-end mt-2 bg-white/5 p-5 border border-white/10 rounded-sm">
          <span className="font-display text-base font-bold uppercase tracking-widest text-white">المنتج متاح للبيع؟</span>
          <input
            type="checkbox"
            {...register("is_available")}
            className="h-6 w-6 accent-white cursor-pointer rounded-sm bg-black border-white/20"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-16 bg-white font-display text-base font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            {isSubmitting ? "جاري الحفظ..." : initialData ? "حفظ التعديلات (SAVE CHANGES)" : "إضافة المنتج (ADD PRODUCT)"}
          </button>
        </div>
      </form>
    </div>
  );
}
