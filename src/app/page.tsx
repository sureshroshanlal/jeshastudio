'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/storefront/Header';
import HeroLookbook from '@/components/storefront/HeroLookbook';
import OccasionDiscovery from '@/components/storefront/OccasionDiscovery';
import ProductCard from '@/components/storefront/ProductCard';
import StudioHallmarks from '@/components/storefront/StudioHallmarks';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import Footer from '@/components/storefront/Footer';
import { useJeshaStore } from '@/lib/store';

type FilterTab = 'all' | 'festive' | 'girls' | 'boys' | 'new';

export default function HomePage() {
  const { products, isLoaded } = useJeshaStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [fitModalOpen, setFitModalOpen] = useState(false);
  const [selectedProductForFit, setSelectedProductForFit] = useState<string | undefined>(undefined);

  const handleOpenFitModal = (prodName?: string) => {
    setSelectedProductForFit(prodName);
    setFitModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'festive') return p.isFestiveEdit;
    if (activeTab === 'girls') return p.gender === 'Girls' || p.gender === 'Unisex';
    if (activeTab === 'boys') return p.gender === 'Boys' || p.gender === 'Unisex';
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#FFFDF9] text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      
      {/* Header */}
      <Header onOpenFitModal={() => handleOpenFitModal()} />

      <main className="flex-1">
        
        {/* 1. Hero Lookbook */}
        <HeroLookbook />

        {/* 2. Visual Categories Navigation */}
        <OccasionDiscovery />

        {/* 3. Functional Product Showcase with Quick Filter Tabs */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Section Header with Category Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-amber-200/60 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-rose-700 font-bold font-sans mb-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Handcrafted Atelier Collection</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Explore the Collection
              </h2>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `All (${products.length})` },
                { id: 'festive', label: `Festive (${products.filter((p) => p.isFestiveEdit).length})` },
                { id: 'girls', label: 'Girls' },
                { id: 'boys', label: 'Boys' },
                { id: 'new', label: 'New In' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FilterTab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-amber-200/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenFitModal={(name) => handleOpenFitModal(name)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-amber-200 shadow-soft">
              <p className="font-serif text-lg text-stone-800 font-semibold">No pieces in this filter yet.</p>
              <button
                onClick={() => setActiveTab('all')}
                className="inline-block mt-3 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                View All Pieces
              </button>
            </div>
          )}

          {/* Catalog Link */}
          <div className="mt-10 text-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <span>View Full Catalog with All Filters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. Compact Trust Hallmarks */}
        <StudioHallmarks />

      </main>

      {/* Sizing Guidance Modal */}
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
