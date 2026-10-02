'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ProductCard from '@/components/storefront/ProductCard';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import { useJeshaStore } from '@/lib/store';
import { ClothSize, ALL_SIZES, Gender, StyleCategory, Occasion } from '@/types';
import { Filter, X, SlidersHorizontal, Sparkles, RefreshCw } from 'lucide-react';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const { products } = useJeshaStore();

  const [selectedSize, setSelectedSize] = useState<ClothSize | 'All'>('All');
  const [selectedGender, setSelectedGender] = useState<Gender | 'All'>('All');
  const [selectedStyle, setSelectedStyle] = useState<StyleCategory | 'All'>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [fitModalOpen, setFitModalOpen] = useState(false);
  const [selectedProductForFit, setSelectedProductForFit] = useState<string | undefined>(undefined);

  // Read URL query params on load
  useEffect(() => {
    const sizeParam = searchParams.get('size') as ClothSize;
    const genderParam = searchParams.get('gender') as Gender;
    const occasionParam = searchParams.get('occasion') as Occasion;
    const styleParam = searchParams.get('style') as StyleCategory;
    const searchParam = searchParams.get('search');

    if (sizeParam && ALL_SIZES.includes(sizeParam)) {
      setSelectedSize(sizeParam);
    }
    if (genderParam && ['Girls', 'Boys', 'Unisex'].includes(genderParam)) {
      setSelectedGender(genderParam);
    }
    if (occasionParam) {
      setSelectedOccasion(occasionParam);
    }
    if (styleParam) {
      setSelectedStyle(styleParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedSize !== 'All' && !p.variants.some((v) => v.size === selectedSize)) return false;
      if (selectedGender !== 'All' && p.gender !== selectedGender && p.gender !== 'Unisex') return false;
      if (selectedStyle !== 'All' && p.styleCategory !== selectedStyle) return false;
      if (selectedOccasion !== 'All' && !p.occasions.includes(selectedOccasion)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCategory = p.styleCategory.toLowerCase().includes(q);
        const matchOccasion = p.occasions.some((o) => o.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCategory && !matchOccasion) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedSize, selectedGender, selectedStyle, selectedOccasion, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedSize('All');
    setSelectedGender('All');
    setSelectedStyle('All');
    setSelectedOccasion('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSize !== 'All' || selectedGender !== 'All' || selectedStyle !== 'All' || selectedOccasion !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#FFFDF9]">
      <Header onOpenFitModal={() => { setSelectedProductForFit(undefined); setFitModalOpen(true); }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Banner with Joyful Luxury Colors */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-100/80 via-rose-50/90 to-emerald-50/80 p-6 sm:p-8 mb-8 border border-amber-200/80 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-rose-600 font-bold font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" /> The Complete Jesha Catalogue
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Curated Kids Wardrobe
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-normal">
              Explore timeless modern Indian, Western, and Indo-western pieces crafted from pure cottons, natural linens, and soft silks (Sizes 16–40).
            </p>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ivory-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-ivory-300 text-xs font-medium text-charcoal-800 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
            <span className="text-xs text-charcoal-600 font-medium">
              Showing <strong className="text-charcoal-900">{filteredProducts.length}</strong> handcrafted designs
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-charcoal-600 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-white border border-ivory-300 rounded-xl text-charcoal-800 focus:outline-none focus:border-rose-400 font-medium cursor-pointer shadow-sm"
            >
              <option value="featured">Featured Designs</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-ivory-200">
            <span className="text-[11px] uppercase font-semibold text-charcoal-600 mr-1">Active:</span>
            {selectedSize !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGender !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pistachio-100 text-pistachio-500 text-xs font-medium">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedStyle !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-powder-100 text-powder-500 text-xs font-medium">
                Style: {selectedStyle}
                <button onClick={() => setSelectedStyle('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedOccasion !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terracotta-100 text-terracotta-600 text-xs font-medium">
                Occasion: {selectedOccasion}
                <button onClick={() => setSelectedOccasion('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ivory-300 text-charcoal-800 text-xs font-medium">
                &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-500 hover:underline ml-auto font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid Layout with Desktop Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-ivory-200 shadow-soft space-y-6 sticky top-36">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <h3 className="font-serif text-base font-semibold text-charcoal-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-rose-500" />
                  <span>Filter Designs</span>
                </h3>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-[11px] text-rose-500 hover:underline">
                    Reset
                  </button>
                )}
              </div>

              {/* Size Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    Garment Size
                  </label>
                  {selectedSize !== 'All' && (
                    <button onClick={() => setSelectedSize('All')} className="text-[10px] text-rose-500 hover:underline">
                      Reset
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('All')}
                    className={`py-1.5 px-2 text-xs rounded-xl font-bold border text-center transition-all col-span-2 ${
                      selectedSize === 'All'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-ivory-50 text-charcoal-700 border-ivory-200 hover:border-charcoal-400'
                    }`}
                  >
                    All Sizes
                  </button>
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-1.5 px-2 text-xs rounded-xl font-bold border text-center transition-all ${
                        selectedSize === sz
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-ivory-50 text-charcoal-700 border-ivory-200 hover:border-charcoal-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['All', 'Girls', 'Boys'] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setSelectedGender(gender)}
                      className={`py-1.5 px-2 text-xs rounded-xl font-medium border text-center transition-all ${
                        selectedGender === gender
                          ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                          : 'bg-ivory-50 text-charcoal-700 border-ivory-200 hover:border-rose-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                  Style Category
                </label>
                <div className="flex flex-col gap-1.5">
                  {(['All', 'Indian', 'Indo-western', 'Western'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`py-1.5 px-3 text-xs rounded-xl font-medium border text-left transition-all ${
                        selectedStyle === style
                          ? 'bg-pistachio-500 text-white border-pistachio-500 font-semibold'
                          : 'bg-ivory-50 text-charcoal-700 border-ivory-200 hover:border-pistachio-300'
                      }`}
                    >
                      {style === 'All' ? 'All Styles' : style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
                  Occasion
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Festive', 'Birthday', 'Wedding', 'Everyday'] as const).map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setSelectedOccasion(occ as any)}
                      className={`py-1 px-2.5 text-xs rounded-lg font-medium border transition-all ${
                        selectedOccasion === occ
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'bg-ivory-50 text-charcoal-700 border-ivory-200 hover:border-charcoal-400'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-ivory-300 shadow-soft">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-500 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                  No Exact Matches in This Filter
                </h3>
                <p className="text-xs text-charcoal-600 mt-2 max-w-md mx-auto">
                  Try clearing some filter criteria, or message our team on WhatsApp for size assistance and matching sets.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-charcoal-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenFitModal={(name) => {
                      setSelectedProductForFit(name);
                      setFitModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-charcoal-900/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-up">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  Filter Catalog
                </h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-charcoal-600" />
                </button>
              </div>

              {/* Size Filter Mobile */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">Size</label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setSelectedSize('All')}
                    className={`py-1.5 px-2 text-xs rounded-xl font-bold border text-center col-span-2 ${selectedSize === 'All' ? 'bg-charcoal-900 text-white' : 'bg-ivory-50'}`}
                  >
                    All
                  </button>
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-1.5 px-2 text-xs rounded-xl font-bold border text-center ${selectedSize === sz ? 'bg-stone-900 text-white' : 'bg-ivory-50 text-stone-700'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter Mobile */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['All', 'Girls', 'Boys'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`py-1.5 px-2 text-xs rounded-xl font-medium border ${selectedGender === gender ? 'bg-rose-500 text-white' : 'bg-ivory-50'}`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Category Mobile */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">Style</label>
                <div className="flex flex-col gap-1.5">
                  {(['All', 'Indian', 'Indo-western', 'Western'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`py-1.5 px-3 text-xs rounded-xl font-medium border text-left ${selectedStyle === style ? 'bg-pistachio-500 text-white' : 'bg-ivory-50'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-ivory-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-2xl bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sizing Modal */}
      <FindTheirFitModal
        isOpen={fitModalOpen}
        onClose={() => setFitModalOpen(false)}
        productName={selectedProductForFit}
      />

      <Footer />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ivory-100 font-serif text-lg">Loading Collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
