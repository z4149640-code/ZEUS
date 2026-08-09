"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-widest text-white">ZEUS</h1>
          <p className="mt-2 font-display text-sm tracking-widest text-white/50 uppercase">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 text-center rounded-sm">
              <p className="text-red-400 text-sm font-display">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">اسم المستخدم</label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-black border border-white/10 px-5 py-4 text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-2 text-right">
            <label className="font-display text-xs uppercase tracking-widest text-white/60">كلمة المرور</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-black border border-white/10 px-5 py-4 text-white focus:border-white/40 outline-none transition-colors text-right rounded-sm"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 h-14 bg-white font-display text-sm font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-white/90 disabled:opacity-50"
          >
            {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
