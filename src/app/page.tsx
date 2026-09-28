'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, HeartHandshake, Ruler, Star } from 'lucide-react';
import Header from '@/components/storefront/Header';
import HeroLookbook from '@/components/storefront/HeroLookbook';
import ShopByAge from '@/components/storefront/ShopByAge';
import OccasionDiscovery from '@/components/storefront/OccasionDiscovery';
import ProductCard from '@/components/storefront/ProductCard';
import AtelierHallmarks from '@/components/storefront/AtelierHallmarks';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import Footer from '@/components/storefront/Footer';
import { useJeshaStore } from '@/lib/store';

export default function HomePage() {
  const { products, isLoaded } = useJeshaStore();
  const [fitModalOpen, setFitModalOpen] = useState(false);
  const [selectedProductForFit, setSelectedProductForFit] = useState<string | undefined>(undefined);

  const handleOpenFitModal = (prodName?: string) => {
    setSelectedProductForFit(prodName);
    setFitModalOpen(true);
  };

  const festiveProducts = products.filter((p) => p.isFestiveEdit).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#FFFDF9] text-stone-900">
      {/* Header */}
      <Header onOpenFitModal={() => handleOpenFitModal()} />

      {/* Hero Lookbook Editorial Carousel */}
      <main className="flex-1">
        <HeroLookbook />

        {/* Discovery Path 1: Shop by Age */}
        <ShopByAge />

        {/* Curated Collection 1: The Festive Edit */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-amber-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-600 font-bold font-sans mb-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Curated Seasonal Capsule
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                The Festive Twirl Edit
              </h2>
            </div>
            <Link
              href="/collections?occasion=Festive"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-rose-600 transition-colors mt-2 sm:mt-0 group"
            >
              <span>View All Festive Pieces ({products.filter((p) => p.isFestiveEdit).length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-rose-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festiveProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenFitModal={(name) => handleOpenFitModal(name)}
              />
            ))}
          </div>
        </section>

        {/* Discovery Path 2: Made for the Moment Occasion Grid */}
        <OccasionDiscovery />

        {/* Curated Collection 2: New Season Arrivals */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-amber-200/60">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-emerald-700 font-bold font-sans">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> Just Arrived at the Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Fresh Off the Loom
              </h2>
            </div>
            <Link
              href="/collections?newArrival=true"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-rose-600 transition-colors mt-2 sm:mt-0 group"
            >
              <span>Explore All New Arrivals</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenFitModal={(name) => handleOpenFitModal(name)}
              />
            ))}
          </div>
        </section>

        {/* Brand Philosophy & Hallmarks */}
        <AtelierHallmarks />
      </main>

      {/* Interactive Sizing Modal */}
      <FindTheirFitModal
        isOpen={fitModalOpen}
        onClose={() => setFitModalOpen(false)}
        productName={selectedProductForFit}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
