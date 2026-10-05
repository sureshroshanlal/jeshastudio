'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Ruler, Sparkles, MessageCircle, Star, ShieldCheck, Heart } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface Muse {
  name: string;
  heightCm: number;
  wearingSize: string;
  outfitName: string;
  outfitSlug: string;
  image: string;
  fitVerdict: string;
  buildType: string;
  tagline: string;
}

const MUSES: Muse[] = [
  {
    name: 'Arya',
    heightCm: 128,
    wearingSize: 'Size 26',
    outfitName: 'Gulabi Organza Anarkali',
    outfitSlug: 'gulabi-organza-anarkali-set',
    image: '/images/hero_twirl_organza.jpg',
    buildType: 'Slender build',
    tagline: 'Ankle-grazing festive flare with zero trip hazard',
    fitVerdict: 'Arya is 128 cm tall. Size 26 drapes just above ankles so she can twirl and run comfortably with cousins during celebrations.',
  },
  {
    name: 'Kabir',
    heightCm: 110,
    wearingSize: 'Size 24',
    outfitName: 'Pistachio Linen Bundi Set',
    outfitSlug: 'pistachio-linen-nehru-jacket-set',
    image: '/images/hero_bundi_boy.jpg',
    buildType: 'Active energetic build',
    tagline: 'Tailored chest with comfort-elastic waist',
    fitVerdict: 'Kabir is 110 cm tall. Size 24 gives a sharp tailored chest silhouette while the elasticated pyjama bottom offers complete running ease.',
  },
  {
    name: 'Vihaan',
    heightCm: 84,
    wearingSize: 'Size 18',
    outfitName: 'Saffron Angrakha Dhoti Set',
    outfitSlug: 'saffron-marigold-angrakha-dhoti-set',
    image: '/images/saffron_angrakha_toddler.jpg',
    buildType: 'Toddler (2 yrs)',
    tagline: 'Adjustable wrap tie-ups · No metal hardware',
    fitVerdict: 'Vihaan is 84 cm tall. Soft fabric wrap-ties adjust smoothly around diaper bulk, eliminating tight necklines or itchy back zips.',
  },
  {
    name: 'Zara',
    heightCm: 116,
    wearingSize: 'Size 24',
    outfitName: 'Dusty Mint Peplum Sharara',
    outfitSlug: 'dusty-mint-peplum-sharara-set',
    image: '/images/mint_peplum_sharara.jpg',
    buildType: 'Lean build',
    tagline: 'Tiered flare with 2-inch alteration margin',
    fitVerdict: 'Zara is 116 cm tall. The peplum sits comfortably at waist, and the tiered sharara has generous hidden hem margins for next year.',
  },
];

export default function LittleMusesFit() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-amber-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-rose-700 font-bold font-sans mb-1.5">
            <Ruler className="w-3.5 h-3.5 text-rose-600" />
            <span>The Twirl Test &bull; Real Fit Transparency</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Meet Our Little Muses
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl font-normal leading-relaxed">
            Every garment at Jesha Studio is real-child tested for twirling, sitting, running, and eating sweets. Here is exactly how our pieces drape on real kids.
          </p>
        </div>

        <a
          href={generateGeneralConciergeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-xs flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <span>Ask Sizing Stylist on WhatsApp</span>
        </a>
      </div>

      {/* 4 Muses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MUSES.map((muse) => (
          <div
            key={muse.name}
            className="group relative rounded-3xl overflow-hidden bg-white border border-amber-200/90 shadow-soft hover:shadow-joy transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-amber-50">
              <Image
                src={muse.image}
                alt={`${muse.name} wearing ${muse.outfitName}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Height Pill */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-200 text-xs font-bold tracking-wider shadow-md">
                  {muse.name} &bull; {muse.heightCm} cm
                </span>
              </div>

              {/* Wears Size Badge */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md">
                  {muse.wearingSize}
                </span>
              </div>

              {/* Outfit Name Tag */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                <p className="text-[10px] text-amber-300 uppercase tracking-wider font-bold font-sans">
                  {muse.buildType}
                </p>
                <p className="font-serif font-bold text-sm text-white truncate">
                  {muse.outfitName}
                </p>
              </div>
            </div>

            {/* Fit Verdict Content */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-white space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {muse.fitVerdict}
              </p>

              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold">
                <Link
                  href={`/product/${muse.outfitSlug}`}
                  className="text-stone-800 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <span>Inspect Outfit</span>
                  <span>&rarr;</span>
                </Link>

                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Twirl Verified</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
