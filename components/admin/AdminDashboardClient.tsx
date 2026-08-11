"use client";

import { useEffect, useState } from "react";
import { supabase, uploadProductImage, type Product, type ProductVariant } from "@/lib/supabase";
import AdminProductList from "./AdminProductList";
import AdminProductForm, { type ProductFormData } from "./AdminProductForm";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminDashboardClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      alert("حدث خطأ أثناء جلب المنتجات.");
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateOrUpdate = async (formData: ProductFormData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const finalVariants: ProductVariant[] = [];

      for (let index = 0; index < formData.variants.length; index++) {
        const variant = formData.variants[index];
        let imageUrl = variant.imageUrl || "";
        
        // imageFile is a FileList, we take the first file if a new one was uploaded
        const fileList = variant.imageFile as FileList;
        if (fileList && fileList.length > 0) {
          const file = fileList[0];
          imageUrl = await uploadProductImage(file);
        } else if (!imageUrl) {
           throw new Error(`مطلوب صورة للون ${variant.colorName}`);
        }

        finalVariants.push({
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          imageUrl: imageUrl,
        });
      }

      let sizeChartUrl = (formData as any).size_chart_url || "";
      const sizeChartFileList = (formData as any).sizeChartFile as FileList;
      if (sizeChartFileList && sizeChartFileList.length > 0) {
        sizeChartUrl = await uploadProductImage(sizeChartFileList[0]);
      }

      const productData = {
        title: formData.title,
        price: formData.price,
        description: formData.description,
        sizes: formData.sizes,
        variants: finalVariants,
        is_available: formData.is_available,
        size_chart_url: sizeChartUrl || null,
      };

      if (editingProduct) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingProduct.id);
        if (error) throw error;
        alert("تم تعديل المنتج بنجاح!");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        alert("تمت الإضافة بنجاح!");
      }

      handleCloseForm();
      fetchProducts(); // Refresh list
      return true;
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert(err.message || "حدث خطأ أثناء حفظ المنتج. يرجى التأكد من الـ Storage bucket.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirm) return;

    setIsDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("حدث خطأ أثناء حذف المنتج.");
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
    setIsDeleting(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between text-right gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-widest text-white">لوحة التحكم</h1>
          <p className="mt-2 font-body text-sm text-white/50">إدارة منتجات متجر ZEUS</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => logoutAction()}
            className="border border-white/20 bg-transparent px-6 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            تسجيل الخروج
          </button>
          <button
            onClick={handleOpenForm}
            className="bg-white px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            + إضافة منتج جديد
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center text-right">
          <button 
            onClick={fetchProducts} 
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white underline font-display"
          >
            تحديث القائمة
          </button>
          <h2 className="font-display text-xl uppercase tracking-widest text-white">المنتجات الحالية</h2>
        </div>
        
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-sm border border-white/10 bg-white/5">
            <p className="font-display text-sm tracking-widest uppercase text-white/50 animate-pulse">جاري التحميل...</p>
          </div>
        ) : (
          <AdminProductList 
            products={products} 
            onDelete={handleDelete}
            onEdit={handleEdit}
            isDeleting={!!isDeleting} 
          />
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl">
            <AdminProductForm 
              onSubmit={handleCreateOrUpdate} 
              isSubmitting={isSubmitting} 
              initialData={editingProduct}
              onCancelEdit={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
