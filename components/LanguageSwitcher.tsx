"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "@/lib/i18n-navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={`group flex items-center gap-1.5 transition-colors ${isPending ? 'opacity-50' : ''} text-white/60 hover:text-white`}
      aria-label="Switch Language"
    >
      <span className="font-display text-sm font-bold tracking-widest mt-0.5">
        {locale === "en" ? "عربي 🇪🇬" : "EN 🇺🇸"}
      </span>
    </button>
  );
}
