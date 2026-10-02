'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { 
  generateGeneralConciergeUrl, 
  JESHA_PHONE_1_DISPLAY, 
  JESHA_PHONE_2_DISPLAY, 
  JESHA_STUDIO_ADDRESS,
  JESHA_WHATSAPP_NUMBER,
  JESHA_WHATSAPP_NUMBER_2
} from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="w-full bg-stone-900 text-stone-200 mt-20 border-t border-stone-800">
      {/* WhatsApp Help & Ordering Banner */}
      <div className="bg-gradient-to-r from-amber-600/25 via-rose-600/25 to-emerald-600/25 py-9 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-amber-300 font-bold font-sans flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Direct Customer Support
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Need help with sizing, matching outfits, or quick delivery?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Message us directly on WhatsApp. We can help you pick the right size and share live photos or videos of the outfits.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={generateGeneralConciergeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-transform transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:+919985531519`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold tracking-wide border border-stone-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info with Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <img
                src="/jesha-logo.jpg"
                alt="Jesha Studio - Kids Fashion"
                className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-amber-300/40 group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-serif text-2xl tracking-[0.16em] font-bold text-white block uppercase">
                  Jesha Studio
                </span>
                <span className="text-[10px] tracking-[0.22em] text-rose-300 uppercase font-sans font-semibold block">
                  Kids Fashion &bull; Little Style. Big Smiles.
                </span>
              </div>
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Thoughtfully designed kids festive and everyday clothing. Comfortable pure mulmul cotton linings, cheerful colors, and kid-tested room to play.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-stone-400 font-medium">
              <span className="text-amber-300">Sizes 16 to 40</span>
              <span>•</span>
              <span className="text-emerald-300">100% Mulmul Lining</span>
              <span>•</span>
              <span className="text-rose-300">Hyderabad, Telangana</span>
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
                  Sizes 16–20 (Toddler Outfits)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=24" className="hover:text-rose-300 transition-colors">
                  Sizes 22–26 (Play &amp; Party)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=28" className="hover:text-emerald-300 transition-colors">
                  Sizes 28–32 (Celebrations)
                </Link>
              </li>
              <li>
                <Link href="/collections?size=36" className="hover:text-sky-300 transition-colors">
                  Sizes 34–40 (Older Kids)
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4 text-amber-200">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link href="/collections?occasion=Festive" className="hover:text-amber-300 transition-colors">
                  Festive Collection
                </Link>
              </li>
              <li>
                <Link href="/collections?occasion=Birthday" className="hover:text-rose-300 transition-colors">
                  Birthday Collection
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

          {/* Contact & Studio Address */}
          <div>
            <h4 className="font-serif text-base font-bold text-white tracking-wide mb-4 text-amber-200">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{JESHA_STUDIO_ADDRESS}</span>
              </li>
              <li className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a href="tel:+919985531519" className="hover:text-emerald-300 transition-colors font-medium">
                    {JESHA_PHONE_1_DISPLAY}
                  </a>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <a href="tel:+918522091817" className="hover:text-emerald-300 transition-colors font-medium">
                    {JESHA_PHONE_2_DISPLAY}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <a 
                  href={`https://wa.me/${JESHA_WHATSAPP_NUMBER}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="mailto:contact@jeshastudio.com" className="hover:text-sky-300 transition-colors">
                  contact@jeshastudio.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 border border-amber-400/30 text-[11px] font-semibold transition-colors shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Jesha Studio. Little Style. Big Smiles. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">Hyderabad, Telangana</span>
            <span>•</span>
            <span className="text-amber-300">WhatsApp Order Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
