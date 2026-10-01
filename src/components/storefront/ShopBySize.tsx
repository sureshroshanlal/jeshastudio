'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Ruler } from 'lucide-react';
import { ALL_SIZES } from '@/types';

interface SizeBracket {
  range: string;
  sizeParam: string;
  title: string;
  subtitle: string;
  image: string;
  badgeBg: string;
  borderAccent: string;
  chestNote: string;
}

const SIZE_BRACKETS: SizeBracket[] = [
  {
    range: 'Sizes 16–20',
    sizeParam: '18',
    title: 'First Steps & Toddler Atelier',
    subtitle: 'Ultra-soft wrap angrakhas, romper sets & butter-soft smocked frocks',
    chestNote: 'Chest ~16–20 inches (41–51 cm)',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-rose-500 text-white',
    borderAccent: 'group-hover:border-rose-300',
  },
  {
    range: 'Sizes 22–26',
    sizeParam: '24',
    title: 'Little Explorers Collection',
    subtitle: 'Twirl-ready tiered frocks, linen bundis & breezy botanical co-ords',
    chestNote: 'Chest ~22–26 inches (56–66 cm)',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-amber-500 text-stone-900 font-bold',
    borderAccent: 'group-hover:border-amber-300',
  },
  {
    range: 'Sizes 28–32',
    sizeParam: '28',
    title: 'Modern Indian Celebrations',
    subtitle: 'Organza anarkalis, peplum shararas & tailored linen bundis',
    chestNote: 'Chest ~28–32 inches (71–81 cm)',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-emerald-600 text-white',
    borderAccent: 'group-hover:border-emerald-300',
  },
  {
    range: 'Sizes 34–40',
    sizeParam: '36',
    title: 'Juniors & Young Miss/Master',
    subtitle: 'Sophisticated festive silhouettes, handloom kurtas & elevated sets',
    chestNote: 'Chest ~34–40 inches (86–102 cm)',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-sky-600 text-white',
    borderAccent: 'group-hover:border-sky-300',
  },
];

export default function ShopBySize() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-amber-200/60">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-600 font-bold font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Tailored by True Proportions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Shop by Size (16 to 40)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-2 sm:mt-0 font-normal">
          Kids of the same age have uniquely different heights and builds. We craft in true numeric garment sizes with generous alteration margins.
        </p>
      </div>

      {/* Quick Access Size Strip */}
      <div className="mb-8 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
          <Ruler className="w-3.5 h-3.5 text-rose-500" /> Jump to Size:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {ALL_SIZES.map((sz) => (
            <Link
              key={sz}
              href={`/collections?size=${sz}`}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-900 text-stone-800 hover:text-white text-xs font-bold border border-amber-200 hover:border-stone-900 transition-all shadow-xs flex-shrink-0 text-center min-w-[2.5rem]"
            >
              {sz}
            </Link>
          ))}
        </div>
      </div>

      {/* 4 Major Size Curations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SIZE_BRACKETS.map((bracket) => (
          <Link
            key={bracket.range}
            href={`/collections?size=${bracket.sizeParam}`}
            className={`group relative rounded-3xl overflow-hidden bg-white border border-amber-200/70 shadow-soft hover:shadow-joy transition-all duration-500 hover:-translate-y-1.5 flex flex-col ${bracket.borderAccent}`}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-amber-50/50">
              <Image
                src={bracket.image}
                alt={bracket.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/75 via-transparent to-transparent" />
              
              {/* Floating Size Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${bracket.badgeBg}`}>
                  {bracket.range}
                </span>
              </div>

              {/* Chest Note Pill */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="text-[10px] text-ivory-100 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full font-medium">
                  {bracket.chestNote}
                </span>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-stone-900 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-md">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                  {bracket.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                  {bracket.subtitle}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] font-bold text-stone-700 flex items-center gap-1 group-hover:text-rose-600 transition-colors">
                <span>Explore {bracket.range}</span>
                <span className="text-rose-500 font-bold">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
