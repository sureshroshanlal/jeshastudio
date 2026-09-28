'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentBg: string;
  linkText: string;
  linkHref: string;
}

const LOOKBOOK_SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'The Festive Edit · 2026',
    title: 'Twirls in Dusty Rose & Pure Organza',
    subtitle: 'Playful Premium × Modern Indian',
    description: 'Featherlight fabrics, handloom borders, and butter-soft mulmul linings. Designed for effortless twirling through family celebrations without scratchy seams.',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-rose-50/80 to-ivory-100/90',
    linkText: 'Explore Festive Collection',
    linkHref: '/collections?occasion=Festive',
  },
  {
    id: 2,
    badge: 'Gentleman’s Atelier',
    title: 'Linen Bundis & Crisp Khadi Sets',
    subtitle: 'Tailored Ease for Boys (0–14 Y)',
    description: 'Earthy pistachio and warm marigold tones crafted in breathable natural fibres. Easy wrap-around angrakhas and comfort-elasticated dhoti pants.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-pistachio-50/80 to-ivory-100/90',
    linkText: 'Explore Boys Collection',
    linkHref: '/collections?gender=Boys',
  },
  {
    id: 3,
    badge: 'Vintage Nostalgia · Everyday Chic',
    title: 'Hand-Smocked Powder Blue Cottons',
    subtitle: 'Heirloom Craft for Modern Childhood',
    description: 'Delicate Peter Pan collars, soft gathers, and gentle puff sleeves. Pieces destined to be treasured, passed down, and worn on sun-drenched afternoons.',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1400&q=90',
    accentBg: 'from-powder-50/80 to-ivory-100/90',
    linkText: 'Shop Heritage Dresses',
    linkHref: '/collections?style=Western',
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
      <div className="relative rounded-[2.5rem] overflow-hidden bg-ivory-200/60 border border-ivory-300 shadow-soft-lg min-h-[540px] md:min-h-[580px] flex items-center">
        
        {/* Background Decorative Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentBg} transition-all duration-1000`} />

        {/* Slide Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
          
          {/* Left: Editorial Storytelling */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-ivory-300 shadow-sm text-xs font-semibold uppercase tracking-[0.15em] text-rose-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-charcoal-600 font-sans font-medium">
                {slide.subtitle}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal-900 leading-[1.15] tracking-tight">
                {slide.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={slide.linkHref}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.linkText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={generateGeneralConciergeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/90 hover:bg-white text-charcoal-800 text-xs font-semibold border border-ivory-300 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                <span>WhatsApp Stylist</span>
              </a>
            </div>

            {/* Atelier hallmarks */}
            <div className="pt-4 border-t border-charcoal-200/40 flex items-center gap-6 text-[11px] text-charcoal-600">
              <span>✓ Ages 0–14 Years</span>
              <span>✓ ₹500–₹2,000 Accessible Atelier</span>
              <span>✓ Pure Breathable Fabrics</span>
            </div>
          </div>

          {/* Right: Editorial Photography Display */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-top transition-all duration-1000 transform hover:scale-105"
              />

              {/* Floating Lookbook Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-ivory-200 shadow-lg text-charcoal-800">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif font-semibold text-charcoal-900">Jesha Studio Signature</p>
                    <p className="text-[11px] text-charcoal-600">Pure Organic Cotton Lining Inside</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-500 font-semibold text-[10px]">
                    Handcrafted
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + LOOKBOOK_SLIDES.length) % LOOKBOOK_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-charcoal-800 shadow-md transition-all hidden sm:flex items-center justify-center"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % LOOKBOOK_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-charcoal-800 shadow-md transition-all hidden sm:flex items-center justify-center"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Pagination */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {LOOKBOOK_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide === idx ? 'w-8 bg-charcoal-900' : 'w-2 bg-charcoal-400/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
