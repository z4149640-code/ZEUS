import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import GlobalUI from '@/components/GlobalUI';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: 'زيوس — ملابس الشارع الفاخرة',
  description: 'زيوس. ملابس شارع فاخرة مصممة لأولئك الذين يتحركون بهدف.',
  icons: {
    icon: '/images/black.png',
  },
  openGraph: {
    images: [
      {
        url: '/images/WhatsApp_Image_2026-07-18_at_3.42.36_AM-removebg-preview.png',
        width: 1200,
        height: 630,
        alt: 'ZEUS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/images/WhatsApp_Image_2026-07-18_at_3.42.36_AM-removebg-preview.png',
        alt: 'ZEUS',
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${cairo.variable} ${cairo.variable}`}>
      <body className="bg-black font-cairo text-white antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GlobalUI />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
