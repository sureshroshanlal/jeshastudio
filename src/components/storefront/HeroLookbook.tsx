'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, MessageCircle, Heart, Star } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface Slide {
  id: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentBg: string;
  linkText: string;
  linkHref: string;
  highlightPill: string;
}

const LOOKBOOK_SLIDES: Slide[] = [
  {
    id: 1,
    badge: '🌸 The Festive Edit · 2026',
    badgeColor: 'bg-rose-100/95 text-rose-700 border-rose-200',
    title: 'Twirls in Radiant Coral & Pure Organza',
    subtitle: 'Playful Premium × Modern Indian',
    description: 'Featherlight fabrics, gleaming gold gota trims, and butter-soft mulmul linings. Designed for joyous twirling through celebrations without scratchy seams.',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-amber-100/70 via-rose-50/80 to-amber-50/70',
    linkText: 'Explore Festive Twirls',
    linkHref: '/collections?occasion=Festive',
    highlightPill: '✨ Pure Butter-Soft Mulmul Lining',
  },
  {
    id: 2,
    badge: '👑 Little Royal Collection',
    badgeColor: 'bg-amber-100/95 text-amber-800 border-amber-300',
    title: 'Linen Bundis & Warm Saffron Kurtas',
    subtitle: 'Tailored Ease for Boys (0–14 Y)',
    description: 'Vibrant marigold and pistachio hues crafted in breathable organic fibres. Easy wrap-around angrakhas and comfort-elasticated dhoti pants.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-emerald-50/70 via-amber-50/80 to-rose-50/70',
    linkText: 'Explore Boys Collection',
    linkHref: '/collections?gender=Boys',
    highlightPill: '🌿 Breathable Organic Handloom',
  },
  {
    id: 3,
    badge: '✨ Heritage Nostalgia · Everyday Chic',
    badgeColor: 'bg-sky-100/95 text-sky-800 border-sky-200',
    title: 'Hand-Smocked Cerulean & Butter Cottons',
    subtitle: 'Heirloom Craft for Joyous Childhood',
    description: 'Delicate Peter Pan collars, soft gathers, and gentle puff sleeves. Pieces destined to be treasured, photographed, and worn on sunny afternoons.',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-sky-50/70 via-purple-50/70 to-amber-50/70',
    linkText: 'Shop Heritage Dresses',
    linkHref: '/collections?style=Western',
    highlightPill: '🎀 Zero-Scratch Concealed Seams',
  },
];

export default function HeroLookbook() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = LOOKBOOK_SLIDES[currentSlide];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-amber-50 via-warm-ivory to-rose-50/60 border border-amber-200/80 shadow-soft-lg min-h-[540px] md:min-h-[580px] flex items-center">
        
        {/* Background Decorative Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentBg} transition-all duration-1000 opacity-90`} />

        {/* Shimmer light effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-300/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl" />

        {/* Slide Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          
          {/* Left: Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border shadow-sm text-xs font-bold uppercase tracking-[0.15em] ${slide.badgeColor}`}>
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-800 font-sans font-bold">
                {slide.subtitle}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.15] tracking-tight">
                {slide.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={slide.linkHref}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 group"
              >
                <span>{slide.linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={generateGeneralConciergeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold border border-amber-200 shadow-sm transition-all hover:border-emerald-500"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp Stylist</span>
              </a>
            </div>

            {/* Craft hallmarks */}
            <div className="pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-700 font-medium">
              <span className="inline-flex items-center gap-1">✨ Sizes 16 to 40</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-rose-700">₹500–₹2,000 Accessible Luxury</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">🌿 100% Breathable Mulmul</span>
            </div>
          </div>

          {/* Right: Editorial Photography Display */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-amber-200/50">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-top transition-all duration-1000 transform hover:scale-105"
              />

              {/* Floating Lookbook Pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="px-4 py-2.5 rounded-2xl bg-stone-900/80 backdrop-blur-md text-white text-xs font-medium flex items-center justify-between border border-white/20 shadow-lg">
                  <span className="text-amber-200 font-semibold truncate flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {slide.highlightPill}
                  </span>
                  <span className="text-rose-300 text-[11px] font-mono">
                    0{currentSlide + 1} / 0{LOOKBOOK_SLIDES.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? LOOKBOOK_SLIDES.length - 1 : prev - 1))}
              className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-stone-800 flex items-center justify-center shadow-lg border border-amber-200 hover:bg-rose-50 hover:text-rose-600 transition-all z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length)}
              className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-stone-800 flex items-center justify-center shadow-lg border border-amber-200 hover:bg-rose-50 hover:text-rose-600 transition-all z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
