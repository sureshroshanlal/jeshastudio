'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail, Star } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="w-full bg-stone-900 text-ivory-100 mt-20 border-t border-stone-800">
      {/* WhatsApp Concierge Banner with Warm Festive Gradient */}
      <div className="bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-emerald-600/30 py-10 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold font-sans flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Personalized Styling Support
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Need assistance with custom sizing, matching sets or fast dispatch?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Our styling team is available on WhatsApp to help you choose the ideal size and send live fabric video previews.
            </p>
          </div>

          <a
            href={generateGeneralConciergeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-xl transition-transform transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.18em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-100 uppercase">
                Jesha Studio
              </span>
              <span className="block text-[11px] tracking-[0.3em] text-amber-300/80 uppercase font-sans font-semibold mt-0.5">
                Joyful Luxury Kids Studio
              </span>
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              A boutique, curated children’s fashion studio combining soft, fresh, and playful aesthetics with modern Indian craftsmanship.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-400 font-medium">
              <span className="inline-flex items-center gap-1 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" /> ₹500–₹2,000 Accessible Luxury
              </span>
              <span>•</span>
              <span className="text-emerald-300">Sizes 16–40</span>
              <span>•</span>
              <span className="text-rose-300">100% Mulmul Lining</span>
            </div>
          </div>

          {/* Shop by Size */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4 text-amber-200">
              Shop by Size
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/collections?size=18" className="hover:text-amber-300 transition-colors">
                  Sizes 16–20 (Toddler &amp; First Steps)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=24" className="hover:text-rose-300 transition-colors">
                  Sizes 22–26 (Little Explorers)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=28" className="hover:text-emerald-300 transition-colors">
                  Sizes 28–32 (Modern Celebrations)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=36" className="hover:text-sky-300 transition-colors">
                  Sizes 34–40 (Young Miss &amp; Master)
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Edits */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4 text-amber-200">
              Curated Edits
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/collections?occasion=Festive" className="hover:text-amber-300 transition-colors">
                  The Festive Edit 2026
                </Link>
              </li>
              <li>
                <Link href="/collections?occasion=Birthday" className="hover:text-rose-300 transition-colors">
                  Birthday Twirl Collection
                </Link>
              </li>
              <li>
                <Link href="/collections?gender=Girls" className="hover:text-rose-300 transition-colors">
                  Girls Collection
                </Link>
              </li>
              <li>
                <Link href="/collections?gender=Boys" className="hover:text-amber-300 transition-colors">
                  Boys Collection
                </Link>
              </li>
              <li>
                <Link href="/brand-story" className="hover:text-emerald-300 transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Concierge & Admin */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4 text-amber-200">
              Jesha Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Bespoke Kids Clothing Studio, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>+91 98765 43210 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>concierge@jeshastudio.com</span>
              </li>
              <li className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-400/30 text-[11px] font-semibold transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Studio Portal</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Jesha Studio. Joyful Luxury × Modern Indian Children&apos;s Fashion. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">WhatsApp-First Direct Commerce</span>
            <span>•</span>
            <span className="text-amber-300">100% Butter-Soft Mulmul Linings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
