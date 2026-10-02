'use client';

import React from 'react';
import { Ruler, Sparkles, Feather, HeartHandshake, Smile } from 'lucide-react';

export default function StudioHallmarks() {
  const hallmarks = [
    {
      icon: Ruler,
      title: 'Transparent "See the Fit"',
      description: 'We publish exact model height in cm and size worn (Sizes 16 to 40) on every product page so you choose with 100% confidence.',
      accent: 'bg-rose-100 text-rose-600 border-rose-200',
    },
    {
      icon: Feather,
      title: 'Butter-Soft Mulmul Linings',
      description: 'Zero scratchiness. Every festive brocade and organza piece is lined with breathable, hypoallergenic pure cotton mulmul.',
      accent: 'bg-amber-100 text-amber-700 border-amber-300',
    },
    {
      icon: Smile,
      title: 'Room to Twirl & Play',
      description: 'Kid-tested ergonomics with deep concealed pockets for treats, soft-guard zippers, and anti-pinch elastic waistbands.',
      accent: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    },
    {
      icon: HeartHandshake,
      title: 'WhatsApp-First Studio',
      description: 'Send us your child’s height and measurements. Our bespoke styling team will guide you to the perfect size (Sizes 16 to 40) and handle fast dispatch.',
      accent: 'bg-sky-100 text-sky-700 border-sky-300',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60 border border-amber-200/80 p-8 sm:p-12 lg:p-16 shadow-soft relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-600 font-bold font-sans flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> The Jesha Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Fashion Boutique Elegance × Playful Childhood Comfort
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
            We bridge the gap between elevated occasion aesthetics and the pure, fuss-free practicality that parents and children need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {hallmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-amber-200/60 shadow-sm hover:shadow-soft-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.accent} border flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
