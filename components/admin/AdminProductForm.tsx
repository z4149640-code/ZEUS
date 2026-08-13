"use client";

import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, X, Tag, ImagePlus } from "lucide-react";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const variantSchema = z.object({
  colorName: z.string().min(1, "مطلوب"),
  colorName_en: z.string().optional(),
  colorHex: z.string().min(4, "مطلوب"),
  images: z.array(z.string()).default([]),   // existing saved URLs
  imageFiles: z.any().optional(),            // newly selected FileList
});

const offerSchema = z.object({
  quantity: z
    .number({ invalid_type_error: "أدخل رقماً" })
    .min(1, "الحد الأدنى 1"),
  price: z
    .number({ invalid_type_error: "أدخل رقماً" })
    .min(1, "مطلوب"),
});

const productSchema = z.object({
  title: z.string().min(2, "يرجى إدخال اسم المنتج"),
  title_en: z.string().optional(),
  price: z.number().min(1, "يرجى إدخال السعر"),
  description: z.string().optional(),
  description_en: z.string().optional(),
  sizes: z.array(z.string()).min(1, "اختر مقاس واحد على الأقل"),
  variants: z.array(variantSchema).min(1, "أضف لون/نسخة واحدة على الأقل"),
  offers: z.array(offerSchema).default([]),
  is_available: z.boolean().default(true),
  size_chart_url: z.string().optional(),
  sizeChartFile: z.any().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import type { Product } from "@/lib/supabase";

type Props = {
  onSubmit: (data: ProductFormData) => Promise<boolean>;
  isSubmitting: boolean;
  initialData?: Product | null;
  onCancelEdit?: () => void;
};

const defaultVariant = { colorName: "", colorName_en: "", colorHex: "#ffffff", images: [], imageFiles: null };
const defaultValues: ProductFormData = {
  title: "",
  title_en: "",
  price: "" as unknown as number,
  description: "",
  description_en: "",
  is_available: true,
  sizes: [],
  variants: [defaultVariant],
  offers: [],
  size_chart_url: "",
  sizeChartFile: null,
};

export default function AdminProductForm({
  onSubmit,
  isSubmitting,
  initialData,
  onCancelEdit,
}: Props) {
  const [sizeInput, setSizeInput] = useState("");
  const sizeChartFileRef = useRef<HTMLInputElement | null>(null);

  const computedInitialData = initialData ? {
    title: initialData.title,
    title_en: initialData.title_en || "",
    price: initialData.price,
    description: initialData.description || "",
    description_en: initialData.description_en || "",
    sizes: initialData.sizes,
    is_available: initialData.is_available,
    variants: initialData.variants.map((v) => ({
      colorName: v.colorName,
      colorName_en: v.colorName_en || "",
      colorHex: v.colorHex,
      images: v.images || [],
      imageFiles: null,
    })),
    offers: initialData.offers || [],
    size_chart_url: initialData.size_chart_url || "",
    sizeChartFile: null,
  } : defaultValues;

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
    defaultValues: computedInitialData,
    values: computedInitialData,
  });

  // ─── Variants field array ────────────────────────────────────────────────
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({ control, name: "variants" });

  // ─── Offers field array ──────────────────────────────────────────────────
  const {
    fields: offerFields,
    append: appendOffer,
    remove: removeOffer,
  } = useFieldArray({ control, name: "offers" });

  // ─── Sizes helpers ───────────────────────────────────────────────────────
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
    setValue(
      "sizes",
      sizes.filter((s) => s !== sizeToRemove),
      { shouldValidate: true }
    );
  };

  const handleToggleOOS = (sizeToToggle: string) => {
    setValue(
      "sizes",
      sizes.map((s) => {
        if (s === sizeToToggle) {
          return s.endsWith(":OOS") ? s.replace(":OOS", "") : s + ":OOS";
        }
        return s;
      }),
      { shouldValidate: true }
    );
  };

  // ─── Remove an already-saved image from a variant ────────────────────────
  const removeExistingImage = (variantIndex: number, imageIndex: number) => {
    const current = watch(`variants.${variantIndex}.images`) || [];
    setValue(
      `variants.${variantIndex}.images`,
      current.filter((_, i) => i !== imageIndex),
      { shouldValidate: true }
    );
  };

  // ─── Submit handler ──────────────────────────────────────────────────────
  const handleFormSubmit = async (data: ProductFormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset(defaultValues);
      replaceVariants([defaultVariant]);
      setSizeInput("");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
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

        {/* Title */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">اسم المنتج (عربي) *</label>
            <input
              {...register("title")}
              className="w-full bg-black border border-white/10 px-5 py-4 text-lg text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm"
              placeholder="مثال: تيشرت زيوس"
            />
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-3 text-right md:text-left">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">
              اسم المنتج (إنجليزي)
            </label>
            <input
              {...register("title_en")}
              className="w-full rounded-sm border border-white/10 bg-black px-5 py-4 text-lg text-white outline-none transition-colors focus:border-white/40 md:text-left"
              placeholder="e.g. ZEUS T-Shirt"
              dir="ltr"
            />
          </div>
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

        {/* Description */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">
              الوصف (عربي)
            </label>
            <textarea
              {...register("description")}
              className="w-full rounded-sm border border-white/10 bg-black px-5 py-4 text-white outline-none transition-colors focus:border-white/40"
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-3 text-right md:text-left">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">
              الوصف (إنجليزي)
            </label>
            <textarea
              {...register("description_en")}
              className="w-full rounded-sm border border-white/10 bg-black px-5 py-4 text-white outline-none transition-colors focus:border-white/40 md:text-left"
              rows={4}
              dir="ltr"
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-3 text-right">
          <label className="font-display text-xs uppercase tracking-widest text-white/60">المقاسات المتاحة *</label>
          <div className="flex flex-wrap gap-2 justify-end mb-2">
            {sizes.map((s) => {
              const isOOS = s.endsWith(":OOS");
              const displayName = isOOS ? s.replace(":OOS", "") : s;
              return (
                <span
                  key={s}
                  className={`flex flex-col gap-2 bg-white/10 px-3 py-2 rounded-sm text-sm font-display uppercase border ${
                    isOOS ? "border-red-500/50 opacity-60" : "border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 justify-between w-full">
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(s)}
                      className="text-white/40 hover:text-white transition-colors"
                      title="حذف المقاس"
                    >
                      <X size={16} />
                    </button>
                    <span className={isOOS ? "line-through text-white/50" : ""}>{displayName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleOOS(s)}
                    className={`text-[10px] px-2 py-1 rounded-sm transition-colors ${
                      isOOS ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {isOOS ? "غير متاح (إرجاع)" : "تعيين كغير متاح"}
                  </button>
                </span>
              );
            })}
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

        {/* ── Variants Section ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 text-right mt-4 bg-black/40 p-6 border border-white/5 rounded-sm">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => appendVariant({ colorName: "", colorHex: "#ffffff", images: [], imageFiles: null })}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 sm:py-2 rounded-sm text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10 w-full sm:w-auto"
            >
              <Plus size={16} /> إضافة لون آخر
            </button>
            <label className="font-display text-lg uppercase tracking-widest text-white w-full sm:w-auto text-right">
              الألوان والصور *
            </label>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {variantFields.map((field, index) => {
              const existingImages = watch(`variants.${index}.images`) || [];
              const newFiles = watch(`variants.${index}.imageFiles`);
              const hasAnyImage = existingImages.length > 0 || (newFiles && newFiles.length > 0);

              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-5 bg-[#111] p-6 border border-white/10 rounded-sm relative group"
                >
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="absolute top-4 left-4 text-white/30 hover:text-red-400 transition-colors bg-black/50 p-2 rounded-full"
                      title="حذف هذا اللون"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  {/* Color Name + Picker Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5 flex flex-col gap-2">
                      <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">اسم اللون (عربي)</label>
                      <input
                        {...register(`variants.${index}.colorName`)}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/40 text-right rounded-sm"
                        placeholder="مثال: أسود قاتم"
                      />
                      {errors.variants?.[index]?.colorName && (
                        <span className="text-red-400 text-xs">{errors.variants[index]?.colorName?.message}</span>
                      )}
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-2">
                      <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold text-right md:text-left">اسم اللون (إنجليزي)</label>
                      <input
                        {...register(`variants.${index}.colorName_en`)}
                        className="w-full bg-black border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/40 md:text-left rounded-sm"
                        placeholder="e.g. Jet Black"
                        dir="ltr"
                      />
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-2 items-end">
                      <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">الدرجة</label>
                      <input
                        type="color"
                        {...register(`variants.${index}.colorHex`)}
                        className="w-12 h-12 rounded-sm border-2 border-white/10 cursor-pointer bg-black p-0.5"
                      />
                    </div>

                    {/* Multi-Image Upload */}
                    <div className="lg:col-span-12 flex flex-col gap-3">
                      <label className="text-[11px] text-white/40 uppercase tracking-widest font-bold">
                        صور اللون
                        <span className="normal-case ml-2 text-white/20">(متعددة)</span>
                      </label>

                      {/* Existing image preview strip */}
                      {existingImages.length > 0 && (
                        <div className="flex gap-2 flex-wrap bg-black/30 p-2 rounded-sm border border-white/5">
                          {existingImages.map((url, imgIdx) => (
                            <div key={imgIdx} className="relative w-14 h-14 group/img flex-shrink-0">
                              <img
                                src={url}
                                alt={`صورة ${imgIdx + 1}`}
                                className="w-full h-full object-cover rounded-sm border border-white/10"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index, imgIdx)}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-md"
                                title="حذف هذه الصورة"
                              >
                                <X size={8} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* File input — multiple */}
                      <div className={`flex items-center gap-3 bg-black border p-3 rounded-sm ${!hasAnyImage ? 'border-red-400/30' : 'border-white/10'}`}>
                        <ImagePlus size={18} className="text-white/30 flex-shrink-0" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          {...register(`variants.${index}.imageFiles`)}
                          className="w-full text-sm text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-white/80 transition-all cursor-pointer"
                        />
                      </div>

                      {!hasAnyImage && (
                        <span className="text-red-400 text-xs">مطلوب صورة واحدة على الأقل</span>
                      )}

                      <p className="text-white/20 text-[10px] text-right">
                        اختر عدة صور دفعة واحدة (الرئيسية، الخلف، تفاصيل...)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.variants && !Array.isArray(errors.variants) && (
            <span className="text-red-400 text-xs mt-2">{errors.variants.message}</span>
          )}
        </div>

        {/* ── Bundle Offers Section ────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 text-right mt-2 bg-black/40 p-6 border border-amber-400/10 rounded-sm">
          <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => appendOffer({ quantity: 2, price: "" as unknown as number })}
              className="flex items-center justify-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 px-4 py-3 sm:py-2 rounded-sm text-xs font-bold uppercase tracking-widest text-amber-300 transition-all border border-amber-400/20 w-full sm:w-auto"
            >
              <Tag size={14} /> إضافة عرض
            </button>
            <div className="text-right">
              <label className="font-display text-lg uppercase tracking-widest text-white">
                🔥 عروض الكميات
              </label>
              <p className="text-xs text-white/30 mt-1 font-body">
                مثال: اشتري 2 بسعر 700 ج.م — يُطبَّق تلقائياً عند اختيار الكمية المناسبة
              </p>
            </div>
          </div>

          {offerFields.length === 0 ? (
            <p className="text-white/25 text-sm text-center py-4 font-body">
              لا توجد عروض حالياً. أضف عرضاً لتشجيع شراء الكميات وزيادة المبيعات.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-1">
                <span className="col-span-5 text-[10px] text-white/30 uppercase tracking-widest text-right">الكمية المطلوبة</span>
                <span className="col-span-6 text-[10px] text-white/30 uppercase tracking-widest text-right">السعر الإجمالي (ج.م)</span>
              </div>

              {offerFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 items-start bg-[#111] px-4 py-4 border border-amber-400/10 rounded-sm"
                >
                  {/* Quantity */}
                  <div className="col-span-5 flex flex-col gap-1.5">
                    <input
                      type="number"
                      {...register(`offers.${index}.quantity`, { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40 text-right rounded-sm transition-colors"
                      placeholder="2"
                      min={1}
                    />
                    {errors.offers?.[index]?.quantity && (
                      <span className="text-red-400 text-xs">{errors.offers[index]?.quantity?.message}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-6 flex flex-col gap-1.5">
                    <input
                      type="number"
                      {...register(`offers.${index}.price`, { valueAsNumber: true })}
                      className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/40 text-right rounded-sm transition-colors"
                      placeholder="700"
                      min={1}
                    />
                    {errors.offers?.[index]?.price && (
                      <span className="text-red-400 text-xs">{errors.offers[index]?.price?.message}</span>
                    )}
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 flex items-center justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      className="text-white/25 hover:text-red-400 transition-colors p-1.5 rounded"
                      title="حذف العرض"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Preview */}
              <div className="mt-1 flex flex-wrap gap-2">
                {offerFields.map((_, i) => {
                  const qty = watch(`offers.${i}.quantity`);
                  const price = watch(`offers.${i}.price`);
                  if (!qty || !price) return null;
                  return (
                    <span key={i} className="text-xs bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3 py-1 rounded-full">
                      🔥 اشتري {qty} بـ {Number(price).toLocaleString()} ج.م
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Size Chart Image */}
        <div className="flex flex-col gap-3 text-right">
          <label className="font-display text-xs uppercase tracking-widest text-white/60">
            صورة دليل المقاسات (Size Chart)
          </label>
          <div className="flex items-center gap-4 bg-black border border-white/10 p-3 rounded-sm">
            {watch("size_chart_url") ? (
              <div className="shrink-0 relative w-16 h-16 group">
                <div className="w-full h-full bg-white/5 rounded-sm border border-white/10 overflow-hidden">
                  <img
                    src={watch("size_chart_url")}
                    alt="Size Chart Preview"
                    className="w-full h-full object-cover"
                  />
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
                <span className="text-white/20 text-[9px] uppercase tracking-widest font-display text-center leading-tight">
                  No<br />Image
                </span>
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
            {isSubmitting
              ? "جاري الحفظ..."
              : initialData
              ? "حفظ التعديلات (SAVE CHANGES)"
              : "إضافة المنتج (ADD PRODUCT)"}
          </button>
        </div>
      </form>
    </div>
  );
}
