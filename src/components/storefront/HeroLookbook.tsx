'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  image: string;
  linkText: string;
  linkHref: string;
  highlight: string;
}

const LOOKBOOK_SLIDES: Slide[] = [
  {
    id: 1,
    badge: '🌸 The Festive Edit',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    title: 'Twirls in Radiant Gulabi &',
    titleAccent: 'Gold Organza',
    subtitle: 'Sizes 20 to 30 · Girls Festive',
    description: 'Featherlight pure organza lined with 100% breathable mulmul cotton. Designed for joyful twirling with zero scratchiness.',
    image: '/images/hero_twirl_organza.jpg',
    linkText: 'Shop Festive Twirls',
    linkHref: '/collections?occasion=Festive',
    highlight: '100% Mulmul Lined',
  },
  {
    id: 2,
    badge: '👑 Little Royal Collection',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    title: 'Slub Linen Bundis & Pure',
    titleAccent: 'Ivory Kurtas',
    subtitle: 'Sizes 16 to 40 · Boys Festive',
    description: 'Tailored pistachio linen Nehru jackets with mother-of-pearl buttons and non-pinching elastic pyjama bottoms.',
    image: '/images/hero_bundi_boy.jpg',
    linkText: 'Shop Boys Collection',
    linkHref: '/collections?gender=Boys',
    highlight: 'Natural Slub Linen',
  },
  {
    id: 3,
    badge: '✨ Heirloom Vintage',
    badgeColor: 'bg-sky-50 text-sky-900 border-sky-200',
    title: 'Hand-Smocked Powder Blue &',
    titleAccent: 'Butter Cotton Frocks',
    subtitle: 'Sizes 18 to 26 · Everyday & Birthday',
    description: 'Delicate Peter Pan collars and soft gathers in featherlight combed cotton. Destined to be worn on sunny afternoons.',
    image: '/images/hero_smock_girl.jpg',
    linkText: 'Shop Heritage Dresses',
    linkHref: '/collections?style=Western',
    highlight: 'Concealed Seams',
  },
];

export default function HeroLookbook() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = LOOKBOOK_SLIDES[currentSlide];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="relative rounded-3xl overflow-hidden bg-white border border-amber-200/80 shadow-soft">
        
        {/* Slide Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          
          {/* Left: Text & Action */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${slide.badgeColor}`}>
                {slide.badge}
              </span>
              <span className="text-xs text-amber-800 font-semibold">
                {slide.subtitle}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
              {slide.title} <span className="italic font-normal text-rose-700">{slide.titleAccent}</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal max-w-lg">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={slide.linkHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
              >
                <span>{slide.linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={generateGeneralConciergeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-stone-800 text-xs font-semibold border border-amber-200 hover:border-emerald-500 transition-all shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp Sizing Help</span>
              </a>
            </div>

            {/* Trust Chips */}
            <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center gap-4 text-xs text-stone-600 font-medium">
              <span>🌿 100% Mulmul Lining</span>
              <span className="text-stone-300">•</span>
              <span>📏 True Sizes 16 to 40</span>
              <span className="text-stone-300">•</span>
              <span>🌸 Hyderabad Atelier</span>
            </div>
          </div>

          {/* Right: Photography Display */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-amber-200/60">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-top transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md text-white text-xs flex items-center justify-between border border-white/10">
                  <span className="text-amber-200 font-medium truncate">✨ {slide.highlight}</span>
                  <span className="text-rose-300 text-[11px] font-mono">0{currentSlide + 1} / 0{LOOKBOOK_SLIDES.length}</span>
                </div>
              </div>
            </div>

            {/* Slide Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? LOOKBOOK_SLIDES.length - 1 : prev - 1))}
              className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-stone-800 flex items-center justify-center shadow-md border border-amber-200 hover:bg-stone-900 hover:text-white transition-all z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length)}
              className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 text-stone-800 flex items-center justify-center shadow-md border border-amber-200 hover:bg-stone-900 hover:text-white transition-all z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {LOOKBOOK_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-stone-900' : 'w-2 bg-amber-200 hover:bg-amber-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
