'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  MessageCircle, 
  Ruler, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  Heart,
  Crown
} from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

interface HeaderProps {
  onOpenFitModal?: () => void;
}

export default function Header({ onOpenFitModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const ageGroups = [
    { label: '0–2 Y', value: '0-2', color: 'hover:bg-amber-100 hover:text-amber-800' },
    { label: '3–5 Y', value: '3-5', color: 'hover:bg-rose-100 hover:text-rose-700' },
    { label: '6–9 Y', value: '6-9', color: 'hover:bg-emerald-100 hover:text-emerald-800' },
    { label: '10–14 Y', value: '10-14', color: 'hover:bg-sky-100 hover:text-sky-800' },
  ];

  const occasions = [
    { name: '✨ Festive Twirls', href: '/collections?occasion=Festive' },
    { name: '🎂 Birthday Magic', href: '/collections?occasion=Birthday' },
    { name: '👑 Wedding Celebrations', href: '/collections?occasion=Wedding' },
    { name: '🌿 Everyday Sunshine', href: '/collections?occasion=Everyday' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Brand Announcement Bar with Joyful Gradient & Gold Accents */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-ivory-100 text-xs py-2.5 px-4 tracking-wider text-center flex items-center justify-center gap-3 border-b border-amber-500/20">
        <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Handcrafted Atelier Kids Wear
        </span>
        <span className="hidden sm:inline text-stone-600">•</span>
        <span className="hidden sm:inline text-ivory-200 text-xs font-normal">
          ✨ Free Express Shipping across India &bull; Pure 100% Mulmul Cotton Linings
        </span>
        <span className="text-stone-600">•</span>
        <Link 
          href="/admin" 
          className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 flex items-center gap-1 text-[11px] font-medium transition-colors"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin Studio
        </Link>
      </div>

      {/* Main Boutique Header */}
      <div className="glass-nav border-b border-amber-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile Menu Trigger & Desktop Navigation */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                className="lg:hidden p-2 text-stone-800 hover:text-rose-600 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
                <Link 
                  href="/collections" 
                  className={`transition-colors hover:text-rose-600 ${pathname === '/collections' ? 'text-rose-600 font-semibold' : 'text-stone-700'}`}
                >
                  Collections
                </Link>
                <Link 
                  href="/collections?gender=Girls" 
                  className="text-stone-700 hover:text-rose-600 transition-colors"
                >
                  Girls
                </Link>
                <Link 
                  href="/collections?gender=Boys" 
                  className="text-stone-700 hover:text-rose-600 transition-colors"
                >
                  Boys
                </Link>

                {/* Occasion Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-stone-700 group-hover:text-rose-600 transition-colors">
                    <span>Occasions</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-stone-400" />
                  </button>
                  <div className="absolute top-full -left-4 w-56 pt-3 hidden group-hover:block transition-all animate-fade-in">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/60 p-2 space-y-1">
                      {occasions.map((occ) => (
                        <Link
                          key={occ.name}
                          href={occ.href}
                          className="block px-3 py-2 text-xs font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"
                        >
                          {occ.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link 
                  href="/brand-story" 
                  className={`transition-colors hover:text-rose-600 ${pathname === '/brand-story' ? 'text-rose-600 font-semibold' : 'text-stone-700'}`}
                >
                  Atelier Story
                </Link>
              </nav>
            </div>

            {/* Center: Brand Wordmark with Golden Sparkle */}
            <div className="flex-1 flex justify-center text-center">
              <Link href="/" className="group inline-flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-bold text-stone-900 group-hover:text-rose-600 transition-colors uppercase">
                  Jesha Studio
                </span>
                <span className="text-[10px] tracking-[0.35em] text-amber-700 font-sans -mt-0.5 font-semibold uppercase">
                  Joyful Luxury &bull; Atelier Kids
                </span>
              </Link>
            </div>

            {/* Right: Interactive Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Find Their Fit Quick Launcher */}
              <button
                onClick={onOpenFitModal}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 text-xs font-semibold border border-amber-300 transition-all shadow-sm transform hover:scale-105"
                title="Interactive Child Size Guide"
              >
                <Ruler className="w-3.5 h-3.5 text-amber-700" />
                <span>Find Their Fit</span>
              </button>

              {/* Search Toggle */}
              <div className="relative">
                {searchOpen ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        window.location.href = `/collections?search=${encodeURIComponent(searchQuery.trim())}`;
                      }
                    }}
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      placeholder="Search lehengas, kurtas, frocks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-44 sm:w-60 pl-3.5 pr-8 py-1.5 text-xs bg-white border border-amber-300 rounded-full focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2.5 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-stone-700 hover:text-rose-600 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* WhatsApp Concierge Button */}
              <a
                href={generateGeneralConciergeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </a>
            </div>

          </div>

          {/* Sub-bar: Shop By Age Fast Chips */}
          <div className="py-2.5 border-t border-amber-200/40 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium whitespace-nowrap">
              <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">Shop by Age:</span>
              {ageGroups.map((group) => (
                <Link
                  key={group.value}
                  href={`/collections?age=${group.value}`}
                  className={`px-3 py-1 rounded-full bg-amber-50/90 text-stone-700 transition-colors text-xs font-semibold border border-amber-200/80 ${group.color}`}
                >
                  {group.label}
                </Link>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-stone-600 font-medium">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                🌿 100% Pure Mulmul Linings
              </span>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700">
                🌸 Room to Twirl &amp; Play
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-amber-200/80 p-6 space-y-5 animate-slide-up shadow-2xl backdrop-blur-xl">
          <div className="space-y-3 font-medium">
            <Link 
              href="/collections" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-stone-800 hover:text-rose-600 font-serif font-semibold"
            >
              All Curated Collections
            </Link>
            <Link 
              href="/collections?gender=Girls" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-stone-800 hover:text-rose-600"
            >
              Girls Collection (0–14 Y)
            </Link>
            <Link 
              href="/collections?gender=Boys" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-stone-800 hover:text-rose-600"
            >
              Boys Atelier (0–14 Y)
            </Link>
            <Link 
              href="/brand-story" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-stone-800 hover:text-rose-600"
            >
              Our Atelier Philosophy
            </Link>
          </div>

          <div className="pt-4 border-t border-amber-100">
            <p className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-2">Shop by Celebration</p>
            <div className="grid grid-cols-2 gap-2">
              {occasions.map((occ) => (
                <Link
                  key={occ.name}
                  href={occ.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 text-xs bg-amber-50/80 border border-amber-200/70 rounded-xl text-stone-800 hover:bg-rose-50 hover:text-rose-600 font-medium"
                >
                  {occ.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFitModal) onOpenFitModal();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2 border border-amber-300 shadow-sm"
            >
              <Ruler className="w-4 h-4 text-amber-700" />
              Find Their Fit (Interactive Sizer)
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-2xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Admin Studio &amp; Inventory Management
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
