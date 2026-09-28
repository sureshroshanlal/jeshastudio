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
  Heart,
  ChevronDown
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
    { label: '0–2 Y', value: '0-2' },
    { label: '3–5 Y', value: '3-5' },
    { label: '6–9 Y', value: '6-9' },
    { label: '10–14 Y', value: '10-14' },
  ];

  const occasions = [
    { name: 'Festive Edit', href: '/collections?occasion=Festive' },
    { name: 'Birthday Twirls', href: '/collections?occasion=Birthday' },
    { name: 'Wedding Celebrations', href: '/collections?occasion=Wedding' },
    { name: 'Everyday Chic', href: '/collections?occasion=Everyday' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Brand Announcement Bar */}
      <div className="bg-charcoal-900 text-ivory-100 text-xs py-2 px-4 tracking-wider text-center uppercase flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-rose-200 font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Atelier Kids Wear
        </span>
        <span className="hidden sm:inline text-charcoal-600">•</span>
        <span className="hidden sm:inline text-ivory-300">
          WhatsApp-First Personalized Fit Assistance &amp; Direct Ordering
        </span>
        <span className="text-charcoal-600">•</span>
        <Link 
          href="/admin" 
          className="text-pistachio-300 hover:text-pistachio-200 underline underline-offset-2 flex items-center gap-1 text-[11px] font-medium"
        >
          <ShieldCheck className="w-3 h-3" /> Admin Studio
        </Link>
      </div>

      {/* Main Boutique Header */}
      <div className="glass-nav border-b border-ivory-300/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile Menu Trigger & Desktop Navigation */}
            <div className="flex items-center gap-8">
              <button
                type="button"
                className="lg:hidden p-2 text-charcoal-800 hover:text-rose-500 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
                <Link 
                  href="/collections" 
                  className={`transition-colors hover:text-rose-500 ${pathname === '/collections' ? 'text-rose-500 font-semibold' : 'text-charcoal-700'}`}
                >
                  Collections
                </Link>
                <Link 
                  href="/collections?gender=Girls" 
                  className="text-charcoal-700 hover:text-rose-500 transition-colors"
                >
                  Girls
                </Link>
                <Link 
                  href="/collections?gender=Boys" 
                  className="text-charcoal-700 hover:text-rose-500 transition-colors"
                >
                  Boys
                </Link>

                {/* Occasion Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 text-charcoal-700 group-hover:text-rose-500 transition-colors">
                    <span>Occasions</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full -left-4 w-56 pt-3 hidden group-hover:block transition-all">
                    <div className="bg-white rounded-xl shadow-soft-lg border border-ivory-300 p-2.5 space-y-1">
                      {occasions.map((occ) => (
                        <Link
                          key={occ.name}
                          href={occ.href}
                          className="block px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
                        >
                          {occ.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link 
                  href="/brand-story" 
                  className={`transition-colors hover:text-rose-500 ${pathname === '/brand-story' ? 'text-rose-500 font-semibold' : 'text-charcoal-700'}`}
                >
                  Atelier Story
                </Link>
              </nav>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex-1 flex justify-center text-center">
              <Link href="/" className="group inline-flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-semibold text-charcoal-900 group-hover:text-rose-500 transition-colors uppercase">
                  Jesha Studio
                </span>
                <span className="text-[10px] tracking-[0.3em] text-charcoal-600 uppercase font-sans -mt-1 font-medium">
                  Atelier Kids Wear
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Find Their Fit Quick Launcher */}
              <button
                onClick={onOpenFitModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pistachio-100 hover:bg-pistachio-200 text-charcoal-800 text-xs font-medium border border-pistachio-300/60 transition-all shadow-sm"
                title="Interactive Child Size Guide"
              >
                <Ruler className="w-3.5 h-3.5 text-pistachio-500" />
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
                      placeholder="Search dresses, kurtas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-40 sm:w-56 pl-3 pr-8 py-1.5 text-xs bg-white border border-ivory-300 rounded-full focus:outline-none focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-2.5 text-charcoal-600 hover:text-charcoal-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-charcoal-700 hover:text-rose-500 transition-colors"
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-medium shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </a>
            </div>

          </div>

          {/* Sub-bar: Shop By Age Fast Chips */}
          <div className="py-2.5 border-t border-ivory-200 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-2 text-xs text-charcoal-600 font-medium whitespace-nowrap">
              <span className="text-[11px] uppercase tracking-wider text-charcoal-600">Quick Age:</span>
              {ageGroups.map((group) => (
                <Link
                  key={group.value}
                  href={`/collections?age=${group.value}`}
                  className="px-3 py-1 rounded-full bg-ivory-200/70 hover:bg-rose-100 hover:text-rose-500 text-charcoal-700 transition-colors text-xs font-medium border border-transparent hover:border-rose-200"
                >
                  {group.label}
                </Link>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-charcoal-600">
              <span className="inline-flex items-center gap-1 text-[11px]">
                🌿 100% Mulmul Cotton Linings
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                🧵 Zero-Scratch Concealed Seams
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-ivory-300 p-6 space-y-5 animate-slide-up shadow-xl">
          <div className="space-y-3 font-medium">
            <Link 
              href="/collections" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-charcoal-800 hover:text-rose-500"
            >
              All Collections
            </Link>
            <Link 
              href="/collections?gender=Girls" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-charcoal-800 hover:text-rose-500"
            >
              Girls (0–14 Y)
            </Link>
            <Link 
              href="/collections?gender=Boys" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-charcoal-800 hover:text-rose-500"
            >
              Boys (0–14 Y)
            </Link>
            <Link 
              href="/brand-story" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-charcoal-800 hover:text-rose-500"
            >
              Our Atelier Philosophy
            </Link>
          </div>

          <div className="pt-4 border-t border-ivory-200">
            <p className="text-xs uppercase tracking-wider text-charcoal-600 font-semibold mb-2">Shop by Occasion</p>
            <div className="grid grid-cols-2 gap-2">
              {occasions.map((occ) => (
                <Link
                  key={occ.name}
                  href={occ.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-xs bg-ivory-100 rounded-lg text-charcoal-800 hover:bg-rose-50 hover:text-rose-500"
                >
                  {occ.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenFitModal) onOpenFitModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-pistachio-100 text-charcoal-800 text-xs font-semibold flex items-center justify-center gap-2 border border-pistachio-300"
            >
              <Ruler className="w-4 h-4 text-pistachio-500" />
              Find Their Fit (Interactive Sizer)
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-charcoal-900 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-pistachio-300" />
              Admin Studio &amp; Inventory Management
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
