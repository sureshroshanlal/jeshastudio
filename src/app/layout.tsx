import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jeshastudio.com'),
  title: 'Jesha Studio — Kids Fashion | Little Style. Big Smiles.',
  description: 'Festive and everyday kids clothing in Sizes 16–40 with butter-soft mulmul linings. Based in Hyderabad, Telangana. Direct WhatsApp ordering & assistance.',
  keywords: ['Jesha Studio', 'kids fashion Hyderabad', 'kids wear Hyderabad', 'festive kids wear', 'boys kurta', 'girls anarkali', 'mulmul lining', 'sizes 16 to 40'],
  icons: {
    icon: '/jesha-logo.jpg',
    apple: '/jesha-logo.jpg',
  },
  openGraph: {
    title: 'Jesha Studio — Kids Fashion | Little Style. Big Smiles.',
    description: 'Festive and everyday kids clothing in Sizes 16–40 with butter-soft mulmul linings. Jesha Studio, Hyderabad, Telangana.',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/jesha-logo.jpg' }],
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
