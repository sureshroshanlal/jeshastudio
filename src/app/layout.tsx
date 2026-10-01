import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jesha Studio — Playful Premium × Modern Indian Kids Fashion House',
  description: 'An atelier-curated kids fashion house in Sizes 16–40. Combining soft luxury, pure breathable fabrics, and effortless WhatsApp-first bespoke shopping.',
  keywords: ['kids fashion', 'modern indian kids wear', 'designer kids clothing', 'ethnic kids wear', 'organic cotton kids', 'atelier kids clothing', 'sizes 16 to 40'],
  openGraph: {
    title: 'Jesha Studio — Modern Kids Fashion House',
    description: 'Playful Premium × Modern Indian kids clothing in Sizes 16–40.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-800 selection:bg-rose-200 selection:text-charcoal-900">
        {children}
      </body>
    </html>
  );
}
