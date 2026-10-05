'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Feather, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Ruler, 
  Scissors, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface FabricSwatch {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  breathability: string;
  softness: number;
  description: string;
  usedIn: string;
  accentColor: string;
}

const FABRIC_SWATCHES: FabricSwatch[] = [
  {
    id: 'mulmul',
    name: 'Pure 100% Cotton Mulmul',
    subtitle: 'The Heart of Every Jesha Piece',
    badge: 'Atelier Signature',
    breathability: '10/10 Natural Airflow',
    softness: 5,
    description: 'Triple-washed long-staple Indian cotton gossamer. We use this as the complete interior lining of every single festive dress, anarkali, and jacket. It feels like a second skin, absorbing humidity and preventing any itching.',
    usedIn: 'All festive anarkalis, frocks, lehengas & bundi linings',
    accentColor: 'border-amber-400 bg-amber-50/80 text-amber-900',
  },
  {
    id: 'organza',
    name: 'Featherlight Pure Organza',
    subtitle: 'Weightless Festive Flairs',
    badge: 'Festive Twirl',
    breathability: '9/10 Airy Drape',
    softness: 5,
    description: 'Crafted with fine cotton-blend silk yarn that produces a luminous, shimmering flare without the stiff plastic feel of synthetic organza. Perfectly billows when little girls spin.',
    usedIn: 'Gulabi Anarkali & Celebration Dupattas',
    accentColor: 'border-rose-400 bg-rose-50/80 text-rose-900',
  },
  {
    id: 'linen',
    name: 'Handloom Slub Linen',
    subtitle: 'Dapper Yet Cooling',
    badge: 'Gentlemen Classics',
    breathability: '10/10 Naturally Thermo-regulating',
    softness: 5,
    description: 'Natural flax fibers hand-spun into a rich textural slub. Crisp and regal in family photographs, yet remarkably cool under warm banquet chandeliers and sunny day weddings.',
    usedIn: 'Boys Bundis, Nehru Jackets & Resort Shirts',
    accentColor: 'border-emerald-400 bg-emerald-50/80 text-emerald-900',
  },
  {
    id: 'chanderi',
    name: 'Fine Viscose Chanderi',
    subtitle: 'Heirloom Sheen & Royal Grace',
    badge: 'Royal Edit',
    breathability: '8.5/10 Fluid Grace',
    softness: 5,
    description: 'A luxurious drape that catches festive candlelight softly. Lined fully with mulmul, so children enjoy the opulent look of Chanderi with the comfort of sleeping in pure cotton pyjamas.',
    usedIn: 'Peplum Sharara sets & Festive Kurtas',
    accentColor: 'border-purple-400 bg-purple-50/80 text-purple-900',
  },
];

export default function MulmulCraftStory() {
  const [activeSwatch, setActiveSwatch] = useState<FabricSwatch>(FABRIC_SWATCHES[0]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Soulful Narrative Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-[0.2em] mb-3">
          <Feather className="w-3.5 h-3.5 text-amber-700" />
          <span>The Soul of Jesha Studio</span>
        </div>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
          Because little celebrations shouldn’t come with <span className="italic font-serif text-rose-700 font-normal">itchy tears.</span>
        </h2>
        
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
          Every parent knows the scene: five minutes into the Diwali puja or family wedding, your child is pulling at their stiff dress, crying that it scratches. We started Jesha Studio in Hyderabad to rewrite that story.
        </p>
      </div>

      {/* Main Craftsmanship Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Visual Textile Photography & Quote Card */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white ring-4 ring-amber-200/50 flex-1">
            <Image
              src="/images/mulmul_craft_atelier.jpg"
              alt="Jesha Studio Hyderabad Handloom Mulmul Cotton Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 450px"
              className="object-cover"
            />
            
            {/* Ambient Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Floating Quote Badge */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200 shadow-lg text-stone-800">
              <p className="font-serif italic text-sm text-stone-900 font-medium">
                &ldquo;Pure mulmul cotton is like a mother’s gentle embrace. Nothing synthetic ever touches your child&apos;s skin.&rdquo;
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-amber-800 font-semibold border-t border-amber-100 pt-2">
                <span>Hyderabad Handcrafted Atelier</span>
                <span className="text-emerald-700 font-bold">100% Itch-Free Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-soft text-center">
            <div className="p-2">
              <span className="block font-serif text-2xl font-bold text-stone-900">100%</span>
              <span className="text-[11px] text-stone-500 font-medium">Mulmul Lined</span>
            </div>
            <div className="p-2 border-x border-amber-100">
              <span className="block font-serif text-2xl font-bold text-rose-700">0</span>
              <span className="text-[11px] text-stone-500 font-medium">Scratchy Seams</span>
            </div>
            <div className="p-2">
              <span className="block font-serif text-2xl font-bold text-amber-600">+2 in</span>
              <span className="text-[11px] text-stone-500 font-medium">Twirl Margin</span>
            </div>
          </div>
        </div>

        {/* Right Column: The Honest Difference Comparison + Swatch Selector */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Honest Comparison Card */}
          <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white border border-amber-200/90 shadow-soft">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>The Tailoring Standard</span>
              <span className="text-xs uppercase tracking-wider font-sans font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                Side-by-Side
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* The Typical Market Trap */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" /> The Mass-Market Trap
                </span>
                <ul className="text-xs text-stone-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Rough metallic zari threads scratching directly against collarbones.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Synthetic polyester linings that trap sweat and cause heat rashes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Rigid metal zippers with no protective under-placket.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Kids in tears 10 minutes into the celebration.</span>
                  </li>
                </ul>
              </div>

              {/* The Jesha Atelier Standard */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-rose-50/50 border border-amber-300 shadow-sm space-y-2.5">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> The Jesha Atelier Standard
                </span>
                <ul className="text-xs text-stone-700 space-y-2">
                  <li className="flex items-start gap-1.5 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% featherlight cotton mulmul lining throughout top and flair.</span>
                  </li>
                  <li className="flex items-start gap-1.5 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Cushioned fabric guards behind all zippers and snap buttons.</span>
                  </li>
                  <li className="flex items-start gap-1.5 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Zero-scratch enclosed French seams that never chafe delicate skin.</span>
                  </li>
                  <li className="flex items-start gap-1.5 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Happy, smiling kids twirling freely until the lights turn off.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Interactive Fabric Swatches Atelier */}
          <div className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FAF5EE] to-white border border-amber-200/90 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-bold font-sans">
                  Tactile Fabric Chamber
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Select a Fabric to Inspect Weave &amp; Softness
                </h4>
              </div>
              <span className="text-xs text-stone-500">Tap to inspect details</span>
            </div>

            {/* Swatch Switcher Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {FABRIC_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => setActiveSwatch(swatch)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    activeSwatch.id === swatch.id
                      ? `${swatch.accentColor} shadow-md scale-[1.02]`
                      : 'bg-white/80 border-amber-200/70 hover:border-amber-400 text-stone-700'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                    {swatch.badge}
                  </span>
                  <span className="font-serif text-xs font-bold block mt-0.5 truncate">
                    {swatch.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Swatch Detail Card */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-serif text-base font-bold text-stone-900">
                    {activeSwatch.name}
                  </h5>
                  <p className="text-xs text-amber-800 font-medium">{activeSwatch.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🍃 {activeSwatch.breathability}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {activeSwatch.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-amber-100">
                <span>
                  <strong className="text-stone-700">Used In:</strong> {activeSwatch.usedIn}
                </span>
                <span className="text-rose-600 font-bold">Softness: 5/5 ⭐</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
