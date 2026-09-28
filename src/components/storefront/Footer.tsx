'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Heart, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="w-full bg-charcoal-900 text-ivory-100 mt-20 border-t border-charcoal-700">
      {/* WhatsApp Concierge Banner */}
      <div className="bg-gradient-to-r from-rose-500/20 via-pistachio-500/20 to-powder-500/20 py-10 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-rose-300 font-semibold font-sans">
              Personalized Atelier Styling
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mt-1">
              Have questions regarding sizing, fabric or matching sets?
            </h3>
            <p className="text-xs text-ivory-300 mt-1 max-w-xl">
              Our styling team is available on WhatsApp to help you choose the ideal size and create custom lookbook combinations.
            </p>
          </div>

          <a
            href={generateGeneralConciergeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-transform transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
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
              <span className="font-serif text-3xl tracking-[0.16em] font-bold text-white uppercase">
                Jesha Studio
              </span>
              <span className="block text-[11px] tracking-[0.3em] text-rose-300 uppercase font-sans font-medium mt-0.5">
                Modern Kids Fashion House
              </span>
            </Link>
            <p className="text-xs text-ivory-300 leading-relaxed max-w-sm">
              An atelier-like, curated children’s fashion house combining soft, fresh, and playful aesthetics with modern Indian craftsmanship.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-ivory-400">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-300" /> ₹500–₹2,000 Accessible Luxury
              </span>
              <span>•</span>
              <span>Ages 0–14</span>
            </div>
          </div>

          {/* Shop by Age */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4">
              Shop by Age
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/collections?age=0-2" className="hover:text-rose-300 transition-colors">
                  0–2 Years (Infants &amp; Toddlers)
                </Link>
              </li>
              <li>
                <Link href="/collections?age=3-5" className="hover:text-rose-300 transition-colors">
                  3–5 Years (Little Explorers)
                </Link>
              </li>
              <li>
                <Link href="/collections?age=6-9" className="hover:text-rose-300 transition-colors">
                  6–9 Years (Modern Indian)
                </Link>
              </li>
              <li>
                <Link href="/collections?age=10-14" className="hover:text-rose-300 transition-colors">
                  10–14 Years (Young Adults)
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Edits */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4">
              Curated Edits
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li>
                <Link href="/collections?occasion=Festive" className="hover:text-rose-300 transition-colors">
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
                <Link href="/collections?gender=Boys" className="hover:text-rose-300 transition-colors">
                  Boys Atelier
                </Link>
              </li>
              <li>
                <Link href="/brand-story" className="hover:text-rose-300 transition-colors">
                  Our Atelier Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Concierge & Admin */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white tracking-wide mb-4">
              Studio Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-300 flex-shrink-0 mt-0.5" />
                <span>Bespoke Kids Atelier, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pistachio-300 flex-shrink-0" />
                <span>+91 98765 43210 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-powder-300 flex-shrink-0" />
                <span>concierge@jeshastudio.com</span>
              </li>
              <li className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-pistachio-300 border border-charcoal-600 text-[11px] font-medium transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Studio Portal</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory-400 gap-4">
          <p>© {new Date().getFullYear()} Jesha Studio. Playful Premium × Modern Indian. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>WhatsApp-First Commerce</span>
            <span>•</span>
            <span>All Garments 100% Mulmul Lined</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
