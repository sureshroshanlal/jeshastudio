'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Feather, HeartHandshake, Ruler, ArrowRight, MessageCircle, MapPin, Phone } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import { 
  generateGeneralConciergeUrl, 
  JESHA_PHONE_1_DISPLAY, 
  JESHA_PHONE_2_DISPLAY, 
  JESHA_STUDIO_ADDRESS 
} from '@/lib/whatsapp';

export default function BrandStoryPage() {
  const [fitModalOpen, setFitModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header onOpenFitModal={() => setFitModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
            <span>Our Story</span>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src="/jesha-logo.jpg"
              alt="Jesha Studio - Kids Fashion"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover shadow-lg border-4 border-white"
            />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
            Little Style. Big Smiles.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-serif italic max-w-2xl mx-auto">
            &ldquo;Kids fashion created with joyful designs, cheerful colors, and butter-soft cotton linings so children feel happy, comfortable, and free to play.&rdquo;
          </p>
        </section>

        {/* Philosophy Image & Story Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85"
                alt="Jesha Studio Kids Wear"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 text-stone-800 shadow-md">
                <p className="font-serif font-bold text-base sm:text-lg text-stone-900">Crafted in Hyderabad</p>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Every piece is lined with breathable mulmul cotton so delicate young skin never touches scratchy fabrics or rough seams.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-amber-700 font-bold font-sans">
                  The Jesha Journey
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Why We Started Jesha Studio
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed">
                  As parents, we know how difficult it can be to find festive kids wear that is both beautiful and comfortable. Too often, festive dresses look attractive in photos but are stiff and itchy, leaving kids cranky within minutes of wearing them.
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  We started <strong>Jesha Studio</strong> in Hyderabad to give parents the best of both worlds: adorable festive and everyday outfits that look stunning in family celebrations, while feeling light, soft, and easy to wear all day long.
                </p>
              </div>

              {/* Hallmarks List */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-stone-900 text-base">Pure 100% Mulmul Linings</h3>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      No itchy zari against young skin. Every festive dress, lehenga, and kurta has an inner layer of butter-soft cotton mulmul.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-stone-900 text-base">Standardized Sizes 16 to 40</h3>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Clear measurements across chest and length for every size, helping you pick with total confidence without confusing age labels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-stone-900 text-base">Direct WhatsApp Help</h3>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Talk directly with our team in Hyderabad. Send your child&apos;s height and chest measurements, and we&apos;ll confirm the ideal fit before shipping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Studio Info Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2 text-stone-900 font-semibold">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{JESHA_STUDIO_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{JESHA_PHONE_1_DISPLAY} &bull; {JESHA_PHONE_2_DISPLAY}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/collections"
                  className="px-6 py-3.5 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={generateGeneralConciergeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full bg-white text-stone-800 text-xs font-semibold border border-stone-300 hover:border-emerald-500 transition-colors shadow-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </section>
      </main>

      <FindTheirFitModal
        isOpen={fitModalOpen}
        onClose={() => setFitModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
