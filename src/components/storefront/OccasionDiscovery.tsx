'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, Cake, Gift, Sun, PartyPopper, Crown } from 'lucide-react';

interface OccasionCard {
  name: string;
  queryValue: string;
  tagline: string;
  description: string;
  icon: any;
  image: string;
  accentGradient: string;
  badgeBg: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    name: 'Festive Twirls',
    queryValue: 'Festive',
    tagline: 'Diwali, Eid & Family Pujas',
    description: 'Bespoke organza anarkalis, handloom linen bundis, and pure gold-thread gota borders designed with itch-free inner mulmul cotton.',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-amber-500/30 to-rose-600/40',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white',
  },
  {
    name: 'Birthday Moments',
    queryValue: 'Birthday',
    tagline: 'Twirls, Candle Blows & Cake',
    description: 'Cloud-soft layered birthday frocks and dapper resort shirts tailored for maximum comfort from candle-lighting to playtime.',
    icon: Cake,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-pink-500/30 to-purple-600/40',
    badgeBg: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
  },
  {
    name: 'Wedding Celebrations',
    queryValue: 'Wedding',
    tagline: 'Miniature Royal Elegance',
    description: 'Tiered peplum shararas, traditional dhoti angrakhas, and festive jacket sets for charming little wedding guests.',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-emerald-500/30 to-amber-600/40',
    badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
  },
  {
    name: 'Everyday Sunshine',
    queryValue: 'Everyday',
    tagline: 'Playground to Sunday Brunches',
    description: 'Breathable combed cotton smocked tops, linen shorts, and breezy co-ords built to withstand everyday childhood adventures.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
    accentGradient: 'from-sky-500/30 to-emerald-600/40',
    badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
  },
];

export default function OccasionDiscovery() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-amber-700 font-bold font-sans flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Made for the Moment
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Curated by Celebration
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-normal">
          Every childhood memory deserves clothing that feels festive yet supremely soft and comfortable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {OCCASIONS.map((occ) => {
          const Icon = occ.icon;
          return (
            <Link
              key={occ.name}
              href={`/collections?occasion=${occ.queryValue}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-amber-200/70 shadow-soft hover:shadow-joy transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-amber-50/50">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${occ.accentGradient} mix-blend-multiply opacity-50 group-hover:opacity-30 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center text-rose-600 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase tracking-wider text-amber-200 font-bold font-sans">
                    {occ.tagline}
                  </p>
                  <h3 className="font-serif text-xl font-bold mt-0.5 text-white">
                    {occ.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <p className="text-xs text-stone-600 line-clamp-2">
                  {occ.description}
                </p>
                <div className="mt-3 pt-3 border-t border-amber-100 text-[11px] font-bold text-stone-800 flex items-center justify-between group-hover:text-rose-600 transition-colors">
                  <span>Explore Edit</span>
                  <span className="text-rose-500">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
