'use client';

import React, { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MessageCircle, 
  Ruler, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart, 
  Share2, 
  ChevronRight,
  Info,
  Feather,
  Layers,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import FindTheirFitModal from '@/components/storefront/FindTheirFitModal';
import ProductCard from '@/components/storefront/ProductCard';
import ProductImageZoom from '@/components/storefront/ProductImageZoom';
import { useJeshaStore } from '@/lib/store';
import { generateProductOrderUrl, generateFitAssistanceUrl } from '@/lib/whatsapp';
import { SizeVariant } from '@/types';

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products, isLoaded } = useJeshaStore();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug);
  }, [products, slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [childChestInput, setChildChestInput] = useState('');
  const [childHeightInput, setChildHeightInput] = useState('');
  const [childBuildInput, setChildBuildInput] = useState('Regular');
  const [fitModalOpen, setFitModalOpen] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (isLoaded && !product) {
    return (
      <div className="min-h-screen flex flex-col bg-ivory-100">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900 mb-2">Piece Not Found</h2>
          <p className="text-xs text-charcoal-600 mb-6">This design might have rotated or been renamed.</p>
          <Link href="/collections" className="px-6 py-3 rounded-full bg-charcoal-900 text-white text-xs font-semibold uppercase tracking-wider">
            Explore Full Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 font-serif text-lg">
        Loading Design...
      </div>
    );
  }

  const selectedVariant: SizeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Complete the Look recommendations (sibling sets or related style)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.styleCategory === product.styleCategory || p.gender !== product.gender))
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#FFFDF9]">
      <Header onOpenFitModal={() => setFitModalOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-charcoal-600 flex items-center gap-1.5 overflow-x-auto">
        <Link href="/" className="hover:text-rose-500">Home</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href="/collections" className="hover:text-rose-500">Collections</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <Link href={`/collections?gender=${product.gender}`} className="hover:text-rose-500">{product.gender}</Link>
        <ChevronRight className="w-3 h-3 text-charcoal-400" />
        <span className="text-charcoal-900 font-medium truncate">{product.name}</span>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Showcase Gallery (Bounded Display Width) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 justify-center items-start w-full">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[540px] no-scrollbar py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EE] flex items-center justify-center p-1 ${
                      activeImageIndex === idx
                        ? 'border-rose-500 shadow-md scale-105 ring-2 ring-rose-200'
                        : 'border-amber-200/80 opacity-70 hover:opacity-100 hover:border-amber-400'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image: Interactive Luxury Pan-Zoom & Lightbox */}
            <ProductImageZoom
              images={product.images || []}
              activeImageIndex={activeImageIndex}
              onImageChange={(idx) => setActiveImageIndex(idx)}
              productName={product.name}
              isFestiveEdit={product.isFestiveEdit}
              styleCategory={product.styleCategory}
              onShare={handleShare}
              copiedLink={copiedLink}
            />
          </div>

          {/* Right Column: Editorial Product Information & Order Desk */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Info */}
            <div className="space-y-2 border-b border-ivory-300 pb-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                <span>{product.gender} • Sizes {product.variants[0]?.size} to {product.variants[product.variants.length - 1]?.size}</span>
                <span className="text-rose-500 font-medium">SKU: {selectedVariant.sku}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
                {product.tagline}
              </p>

              {/* Price & Savings */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                  ₹{selectedVariant.price}
                </span>
                <span className="text-sm text-charcoal-600 line-through">
                  ₹{selectedVariant.mrp}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    Save {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-charcoal-600">
                Inclusive of all taxes. Free Pan-India express delivery.
              </p>
            </div>

            {/* Jesha Feature 1: "See the Fit" Model Component */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-ivory-100 to-pistachio-50/70 border border-ivory-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-rose-500">
                  <Ruler className="w-3.5 h-3.5" /> See the Fit — Model Stats
                </span>
                <span className="text-[11px] font-semibold text-charcoal-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-ivory-300">
                  Wears Size: {product.modelFit.wearingSize}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-ivory-200">
                  <span className="text-[10px] text-charcoal-600 uppercase font-semibold block">Model Height</span>
                  <span className="font-serif font-bold text-charcoal-900 text-sm">{product.modelFit.heightCm} cm</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-ivory-200">
                  <span className="text-[10px] text-charcoal-600 uppercase font-semibold block">Size Worn in Photos</span>
                  <span className="font-serif font-bold text-rose-600 text-sm">Size {product.modelFit.wearingSize}</span>
                </div>
              </div>

              {product.modelFit.fitNote && (
                <p className="text-xs text-charcoal-700 italic pt-1 leading-snug">
                  &ldquo;{product.modelFit.fitNote}&rdquo;
                </p>
              )}
            </div>

            {/* Size Selector with Live Stock Indication */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                  Choose Size: <span className="font-serif font-bold text-rose-500">{selectedVariant.size}</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Chart (cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitModalOpen(true)}
                    className="text-xs text-pistachio-500 hover:underline font-medium"
                  >
                    Fit Calculator
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.variants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  const isLowStock = variant.stock <= 3 && variant.stock > 0;
                  const isOutOfStock = variant.stock === 0;

                  return (
                    <button
                      key={variant.sku}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`relative py-3 px-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md'
                          : isOutOfStock
                          ? 'bg-ivory-200 text-charcoal-600 border-ivory-300 opacity-50 cursor-not-allowed line-through'
                          : 'bg-white text-charcoal-800 border-ivory-300 hover:border-rose-400'
                      }`}
                    >
                      <div className="font-serif font-bold text-sm">{variant.size}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-rose-200' : 'text-charcoal-600'}`}>
                        {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${variant.stock} left` : `In Stock`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jesha Feature 2: Optional Fit Verification Input for WhatsApp */}
            <div className="p-4 rounded-2xl bg-white border border-ivory-300 space-y-3 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                  Optional: Verify Child&apos;s Fit
                </span>
                <span className="text-[10px] text-rose-500 font-medium">Tailoring Verification</span>
              </div>
              <p className="text-xs text-charcoal-600">
                Not 100% sure? Provide your child&apos;s details and we&apos;ll automatically attach it to your WhatsApp order for stylist review.
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-charcoal-600 mb-1">Chest (Inches)</label>
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    value={childChestInput}
                    onChange={(e) => setChildChestInput(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-charcoal-600 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 110"
                    value={childHeightInput}
                    onChange={(e) => setChildHeightInput(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-charcoal-600 mb-1">Build</label>
                  <select
                    value={childBuildInput}
                    onChange={(e) => setChildBuildInput(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-rose-400"
                  >
                    <option value="Slim">Slim</option>
                    <option value="Regular">Regular</option>
                    <option value="Chubby/Broad">Broad</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Order on WhatsApp Action */}
            <div className="space-y-3 pt-2">
              <a
                href={generateProductOrderUrl({
                  product,
                  selectedVariant,
                  childChestInches: childChestInput || undefined,
                  childHeightCm: childHeightInput ? parseInt(childHeightInput) : undefined,
                  childBuild: childBuildInput || undefined,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-serif text-base font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp (₹{selectedVariant.price})</span>
              </a>

              <div className="flex items-center justify-center gap-6 text-[11px] text-charcoal-600 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> Fast Dispatch (24–48h)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" /> Easy Size Exchange
                </span>
              </div>
            </div>

            {/* Little Details & Craftsmanship Specs */}
            <div className="pt-6 border-t border-ivory-300 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                The Little Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-ivory-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0 mt-0.5">
                    <Feather className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-charcoal-900 mb-0.5">Fabric &amp; Pure Lining</strong>
                    <p className="text-charcoal-600 leading-relaxed">
                      {product.details.fabric}. Lined with <strong>{product.details.lining}</strong> for all-day itch-free comfort.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-ivory-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pistachio-100 flex items-center justify-center text-pistachio-500 flex-shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-charcoal-900 mb-0.5">Closures &amp; Pockets</strong>
                    <p className="text-charcoal-600 leading-relaxed">
                      {product.details.closure}. {product.details.pockets}.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-ivory-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-powder-100 flex items-center justify-center text-powder-500 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-charcoal-900 mb-0.5">Set Contents</strong>
                    <p className="text-charcoal-600 leading-relaxed">
                      {product.details.setIncludes}.
                    </p>
                  </div>
                </div>

                {/* Care instructions */}
                <div className="p-4 rounded-xl bg-ivory-200/60 border border-ivory-300">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-700 block mb-1.5">
                    Care Instructions
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-charcoal-600 text-xs">
                    {product.details.careInstructions.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Complete the Look / Styling Recommendations */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-ivory-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-rose-500 font-semibold font-sans">
                  Stylist Recommendations
                </span>
                <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mt-0.5">
                  Complete the Look &amp; Sibling Sets
                </h2>
              </div>
              <Link href="/collections" className="text-xs font-semibold text-charcoal-800 hover:text-rose-500 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onOpenFitModal={() => setFitModalOpen(true)} />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-ivory-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div>
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                  Garment Size Chart ({product.name})
                </h3>
                <p className="text-xs text-charcoal-600">Measurements in centimeters (cm)</p>
              </div>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-1 rounded-full text-charcoal-600 hover:bg-ivory-100"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-ivory-300 text-charcoal-600 font-semibold uppercase text-[10px]">
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Chest (cm)</th>
                    <th className="py-2 px-3">Waist (cm)</th>
                    <th className="py-2 px-3">Length (cm)</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {product.variants.map((v) => (
                    <tr key={v.sku} className="hover:bg-ivory-50">
                      <td className="py-2 px-3 font-semibold text-charcoal-900">{v.size}</td>
                      <td className="py-2 px-3">{v.chestCm || '—'}</td>
                      <td className="py-2 px-3">{v.waistCm || '—'}</td>
                      <td className="py-2 px-3">{v.lengthCm || '—'}</td>
                      <td className="py-2 px-3">
                        {v.stock > 0 ? (
                          <span className="text-emerald-600 font-medium">Available</span>
                        ) : (
                          <span className="text-charcoal-600">Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-charcoal-600 italic">
              * Note: Garments include 2–3 cm tailoring margin for easy alteration as your child grows.
            </p>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold"
            >
              Close Chart
            </button>
          </div>
        </div>
      )}

      {/* Sizing Assistant Modal */}
      <FindTheirFitModal
        isOpen={fitModalOpen}
        onClose={() => setFitModalOpen(false)}
        productName={product.name}
      />

      <Footer />
    </div>
  );
}
