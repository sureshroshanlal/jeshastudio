'use client';

import React from 'react';
import { Ruler, Sparkles, Feather, HeartHandshake, ShieldCheck, Smile } from 'lucide-react';

export default function AtelierHallmarks() {
  const hallmarks = [
    {
      icon: Ruler,
      title: 'Transparent "See the Fit"',
      description: 'We publish exact model age, height in cm, and size worn on every product page so you choose with 100% confidence.',
      accent: 'bg-rose-100 text-rose-500',
    },
    {
      icon: Feather,
      title: 'Butter-Soft Mulmul Linings',
      description: 'Zero scratchiness. Every festive brocade and organza piece is lined with breathable, hypoallergenic pure cotton mulmul.',
      accent: 'bg-pistachio-100 text-pistachio-500',
    },
    {
      icon: Smile,
      title: 'Room to Twirl & Play',
      description: 'Kid-tested ergonomics with deep concealed pockets for treats, soft-guard zippers, and anti-pinch elastic waistbands.',
      accent: 'bg-powder-100 text-powder-500',
    },
    {
      icon: HeartHandshake,
      title: 'WhatsApp-First Atelier',
      description: 'Send us your child’s height and age. Our bespoke styling team will guide you to the perfect silhouette and handle fast dispatch.',
      accent: 'bg-terracotta-100 text-terracotta-600',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-ivory-50 via-white to-rose-50/40 border border-ivory-300 p-8 sm:p-12 lg:p-16 shadow-soft">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rose-500 font-semibold font-sans">
            The Jesha Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 mt-1">
            Fashion Boutique Presentation × Frictionless Parent Shopping
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-3 leading-relaxed">
            We bridge the gap between elevated occasion aesthetics and the pure, fuss-free practicality that parents and children need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {hallmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/80 border border-ivory-200/80 shadow-sm hover:shadow-soft transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.accent} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-semibold text-charcoal-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
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
