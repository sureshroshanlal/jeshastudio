'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryCard {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  badge: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Girls Festive Twirls',
    subtitle: 'Organza Anarkalis & Peplum Shararas',
    href: '/collections?gender=Girls',
    image: '/images/hero_twirl_organza.jpg',
    badge: 'Girls',
  },
  {
    title: 'Boys Little Royals',
    subtitle: 'Linen Bundis & Comfort Dhoti Sets',
    href: '/collections?gender=Boys',
    image: '/images/hero_bundi_boy.jpg',
    badge: 'Boys',
  },
  {
    title: 'Birthday & Western',
    subtitle: 'Tiered Party Frocks & Smocked Dresses',
    href: '/collections?style=Western',
    image: '/images/birthday_tulle_frock.jpg',
    badge: 'Celebrations',
  },
  {
    title: 'Toddlers & First Steps',
    subtitle: 'Pure Cotton Wrap Angrakhas & Sets',
    href: '/collections?size=18',
    image: '/images/saffron_angrakha_toddler.jpg',
    badge: 'Sizes 16–22',
  },
];

export default function OccasionDiscovery() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-amber-200/60">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Handcrafted with 100% mulmul linings and zero scratchiness.
          </p>
        </div>
        <Link
          href="/collections"
          className="text-xs font-bold text-stone-800 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group relative rounded-2xl overflow-hidden bg-white border border-amber-200/80 shadow-soft hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-amber-50">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-stone-800 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {cat.badge}
                </span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-white">
                <h3 className="font-serif text-sm sm:text-base font-bold leading-snug">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-amber-200 truncate mt-0.5 font-normal">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
