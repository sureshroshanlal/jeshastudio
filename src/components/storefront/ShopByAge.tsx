'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface AgeBracket {
  range: string;
  queryValue: string;
  title: string;
  subtitle: string;
  image: string;
  badgeBg: string;
}

const AGE_BRACKETS: AgeBracket[] = [
  {
    range: '0–2 Years',
    queryValue: '0-2',
    title: 'Infant & Toddler Atelier',
    subtitle: 'Ultra-soft wrap angrakhas, romper sets & butter-soft smocked frocks',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-rose-100 text-rose-500',
  },
  {
    range: '3–5 Years',
    queryValue: '3-5',
    title: 'Little Explorers',
    subtitle: 'Twirl-ready tiered frocks, linen bundis & breezy botanical co-ords',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-pistachio-100 text-pistachio-500',
  },
  {
    range: '6–9 Years',
    queryValue: '6-9',
    title: 'Modern Indian Celebrations',
    subtitle: 'Organza anarkalis, peplum shararas & tailored linen bundis',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-powder-100 text-powder-500',
  },
  {
    range: '10–14 Years',
    queryValue: '10-14',
    title: 'Young Gentleman & Miss',
    subtitle: 'Sophisticated festive silhouettes, handloom kurtas & elevated sets',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    badgeBg: 'bg-terracotta-100 text-terracotta-600',
  },
];

export default function ShopByAge() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-ivory-300">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-500 font-semibold font-sans">
            Tailored by Milestone
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900 mt-1">
            Shop by Age Group
          </h2>
        </div>
        <p className="text-xs text-charcoal-600 max-w-sm mt-2 sm:mt-0">
          Thoughtfully proportioned silhouettes designed specifically for childhood movement and growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {AGE_BRACKETS.map((bracket) => (
          <Link
            key={bracket.range}
            href={`/collections?age=${bracket.queryValue}`}
            className="group relative rounded-3xl overflow-hidden bg-white border border-ivory-200 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-ivory-100">
              <Image
                src={bracket.image}
                alt={bracket.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
              
              {/* Floating Age Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-serif font-bold shadow-sm ${bracket.badgeBg}`}>
                  {bracket.range}
                </span>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-charcoal-900 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900 group-hover:text-rose-500 transition-colors">
                  {bracket.title}
                </h3>
                <p className="text-xs text-charcoal-600 mt-1 leading-relaxed line-clamp-2">
                  {bracket.subtitle}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-ivory-200 text-[11px] font-semibold text-charcoal-700 flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                <span>Explore {bracket.range}</span>
                <span className="text-rose-400">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
