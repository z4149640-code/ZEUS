import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });

export const metadata: Metadata = {
  title: 'زيوس — ملابس الشارع الفاخرة',
  description: 'زيوس. ملابس شارع فاخرة مصممة لأولئك الذين يتحركون بهدف.',
 openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cairo.variable}`}>
      <body className="bg-black font-cairo text-white antialiased">{children}</body>
    </html>
  );
}
