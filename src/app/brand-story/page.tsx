'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Feather, HeartHandshake, Ruler, ArrowRight, MessageCircle } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

export default function BrandStoryPage() {
  const [fitModalOpen, setFitModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Header onOpenFitModal={() => setFitModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-rose-500 font-semibold font-sans mb-3 inline-block">
            Our Atelier Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal-900 leading-tight">
            Playful Premium × Modern Indian
          </h1>
          <p className="mt-6 text-base sm:text-lg text-charcoal-700 leading-relaxed font-serif italic max-w-3xl mx-auto">
            &ldquo;Jesha Studio is a soft, fresh and contemporary Indian kids fashion house that combines editorial fashion presentation with highly practical, parent-friendly shopping.&rdquo;
          </p>
        </section>

        {/* Philosophy Image & Manifesto Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85"
                alt="Jesha Studio Atelier Craft"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-ivory-200 text-charcoal-800 shadow-lg">
                <p className="font-serif font-bold text-lg text-charcoal-900">The Studio Interpretation</p>
                <p className="text-xs text-charcoal-600 mt-1">
                  Curation, creativity, taste, and bespoke tailoring — crafted specifically for childhood joys.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-pistachio-500 font-bold font-sans">
                  The Genesis
                </span>
                <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
                  Why We Founded Jesha Studio
                </h2>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  As parents, we noticed a persistent divide in children’s occasionwear: either stiff, scratchy traditional ethnic wear that children despised wearing after 10 minutes, or generic mass-market clothing lacking aesthetic soul.
                </p>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  We created <strong>Jesha Studio</strong> to offer an atelier experience that celebrates modern Indian aesthetics through pure organic cottons, soft mulmul linings, and effortless silhouettes (Sizes 16 to 40).
                </p>
              </div>

              {/* Hallmarks List */}
              <div className="space-y-4 pt-4 border-t border-ivory-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0 mt-1">
                    <Feather className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-charcoal-900 text-base">Pure Mulmul Linings</h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed mt-0.5">
                      Every seam is bound and every festive organza or brocade piece is fully lined in breathable, butter-soft mulmul cotton.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-pistachio-100 flex items-center justify-center text-pistachio-500 flex-shrink-0 mt-1">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-charcoal-900 text-base">Transparent &apos;See the Fit&apos;</h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed mt-0.5">
                      Every photoshoot documents the child model&apos;s exact height in centimeters and size worn so parents can shop with certainty.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-powder-100 flex items-center justify-center text-powder-500 flex-shrink-0 mt-1">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-charcoal-900 text-base">WhatsApp Concierge Service</h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed mt-0.5">
                      No cold chatbots. Chat directly with human stylists who understand growth spurts, sibling coordinating sets, and event timelines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-4">
                <Link
                  href="/collections"
                  className="px-6 py-3.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-charcoal-800 transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Explore The Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={generateGeneralConciergeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-full bg-white text-charcoal-800 text-xs font-semibold border border-ivory-300 hover:border-rose-300 transition-colors shadow-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Chat With Us</span>
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
