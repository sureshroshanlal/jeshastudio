'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Ruler, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { ALL_SIZES } from '@/types';

interface GrowthStage {
  id: string;
  stageName: string;
  sizes: string[];
  ageApprox: string;
  chestNote: string;
  heightNote: string;
  title: string;
  description: string;
  image: string;
  tagColor: string;
  accentBorder: string;
  craftHighlight: string;
  popularPieces: string[];
}

const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 'stage-1',
    stageName: 'Stage 1 · Tiny Twirlers',
    sizes: ['16', '18', '20'],
    ageApprox: '6 months – 2.5 yrs',
    chestNote: 'Chest 16–20" (41–51 cm)',
    heightNote: 'Height ~75–95 cm',
    title: 'First Steps & Toddler Outfits',
    description: 'Ultra-soft wrap angrakhas, romper sets, and butter-soft smocked frocks designed with cotton tie-ups rather than harsh metal zippers.',
    image: '/images/saffron_angrakha_toddler.jpg',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    accentBorder: 'hover:border-amber-400',
    craftHighlight: 'No metallic zippers · Gentle tie-ups · Diaper ease',
    popularPieces: ['Saffron Angrakha Dhoti', 'First Birthday Romper', 'Butter Cotton Smocks'],
  },
  {
    id: 'stage-2',
    stageName: 'Stage 2 · Joyful Explorers',
    sizes: ['22', '24', '26'],
    ageApprox: '3 – 6.5 yrs',
    chestNote: 'Chest 22–26" (56–66 cm)',
    heightNote: 'Height ~98–122 cm',
    title: 'Twirl Anarkalis & Linen Bundis',
    description: 'Designed for active running, dancing, and twirling. Ankle-clearing hem lengths prevent tripping, with deep secret pockets for treats.',
    image: '/images/hero_twirl_organza.jpg',
    tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
    accentBorder: 'hover:border-rose-400',
    craftHighlight: 'Ankle-clearing hem · 100% Mulmul lining · Deep pockets',
    popularPieces: ['Gulabi Organza Anarkali', 'Pistachio Linen Bundi', 'Botanical Resort Set'],
  },
  {
    id: 'stage-3',
    stageName: 'Stage 3 · Celebration Stars',
    sizes: ['28', '30', '32'],
    ageApprox: '7 – 10 yrs',
    chestNote: 'Chest 28–32" (71–81 cm)',
    heightNote: 'Height ~125–140 cm',
    title: 'Peplum Shararas & Royal Kurtas',
    description: 'Modern Indo-western silhouettes tailored with comfort-elasticated waistbands, lightweight dupattas, and generous 2-inch alteration margins.',
    image: '/images/mint_peplum_sharara.jpg',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accentBorder: 'hover:border-emerald-400',
    craftHighlight: 'Non-pinching waists · Concealed YKK zip · +2in Margin',
    popularPieces: ['Dusty Mint Peplum Sharara', 'Heritage Bundi Sets', 'Pastel Kurta Pyjama'],
  },
  {
    id: 'stage-4',
    stageName: 'Stage 4 · Young Miss & Master',
    sizes: ['34', '36', '38', '40'],
    ageApprox: '11 – 15 yrs',
    chestNote: 'Chest 34–40" (86–102 cm)',
    heightNote: 'Height ~142–168 cm',
    title: 'Junior Ensembles & Classic Kurtas',
    description: 'Sophisticated festive styles tailored with adult-grade craftsmanship, yet preserving pure cotton breathability and effortless movement.',
    image: '/images/festive_celebration_banner.jpg',
    tagColor: 'bg-sky-100 text-sky-900 border-sky-300',
    accentBorder: 'hover:border-sky-400',
    craftHighlight: 'Tailored drape · Breathable cottons · Heirloom grace',
    popularPieces: ['Classic Mustard Kurta', 'Celebration Sherwani Bundi', 'Tiered Festive Sets'],
  },
];

export default function ShopBySize() {
  const [activeStageId, setActiveStageId] = useState<string>('stage-2');

  const activeStage = GROWTH_STAGES.find((s) => s.id === activeStageId) || GROWTH_STAGES[1];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-amber-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-rose-700 font-bold font-sans mb-1.5">
            <Ruler className="w-3.5 h-3.5 text-rose-600" />
            <span>True Proportions Studio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Shop by Size (16 to 40)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl font-normal leading-relaxed">
            Two kids of the exact same age often have completely different builds. We craft by standardized garment measurements with built-in growth margins—so you never have to guess.
          </p>
        </div>

        {/* Quick Size Jump Pills */}
        <div className="flex flex-wrap items-center gap-1.5 max-w-md">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mr-1">
            Jump to Size:
          </span>
          {ALL_SIZES.map((sz) => (
            <Link
              key={sz}
              href={`/collections?size=${sz}`}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-900 text-stone-800 hover:text-white text-xs font-bold border border-amber-200 hover:border-stone-900 transition-all shadow-2xs text-center"
            >
              {sz}
            </Link>
          ))}
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {GROWTH_STAGES.map((stg) => (
          <button
            key={stg.id}
            onClick={() => setActiveStageId(stg.id)}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeStageId === stg.id
                ? 'bg-white border-rose-500 shadow-soft-lg scale-[1.02] ring-2 ring-rose-200/50'
                : 'bg-white/70 hover:bg-white border-amber-200/80 text-stone-700'
            }`}
          >
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1.5 ${stg.tagColor}`}>
              Sizes {stg.sizes.join(', ')}
            </span>
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 block truncate">
              {stg.title}
            </h3>
            <span className="text-[11px] text-stone-500 block mt-1">
              Approx. {stg.ageApprox}
            </span>
          </button>
        ))}
      </div>

      {/* Active Stage Interactive Showcase */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-white border border-amber-200/90 shadow-soft-lg p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Authentic Stage Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white ring-4 ring-amber-200/60">
              <Image
                src={activeStage.image}
                alt={activeStage.title}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Size Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-200 text-xs font-bold uppercase tracking-wider border border-white/20 shadow-md">
                  Sizes {activeStage.sizes.join(', ')}
                </span>
              </div>

              {/* Proportions Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="p-3 rounded-2xl bg-stone-900/85 backdrop-blur-md text-white text-xs border border-white/20 shadow-lg flex items-center justify-between">
                  <span className="text-amber-100 font-medium">{activeStage.chestNote}</span>
                  <span className="text-stone-300 text-[11px]">{activeStage.heightNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stage Guidance & Curated Collections */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <span>{activeStage.stageName}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {activeStage.title}
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* Craft Hallmarks for this stage */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Tailoring Considerations for this Stage:
              </span>
              <p className="text-xs text-stone-700 font-medium">
                {activeStage.craftHighlight}
              </p>
            </div>

            {/* Popular Curations in this bracket */}
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Signature Silhouettes in Sizes {activeStage.sizes.join(', ')}:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeStage.popularPieces.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-stone-800 shadow-2xs"
                  >
                    ✨ {p}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4 border-t border-amber-100">
              <Link
                href={`/collections?size=${activeStage.sizes[0]}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all group"
              >
                <span>Explore Sizes {activeStage.sizes.join(', ')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <span className="text-xs text-stone-500">
                Need custom sizing? Our team can tailor specific chest or length alterations.
              </span>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
