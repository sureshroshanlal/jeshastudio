'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Ruler, Sparkles, ArrowUpRight, Star } from 'lucide-react';
import { Product } from '@/types';
import { generateProductOrderUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpenFitModal?: (productName: string) => void;
}

export default function ProductCard({ product, onOpenFitModal }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  const currentVariant = product.variants[selectedSizeIndex] || product.variants[0];
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80';
  const hoverImage = product.images[1] || primaryImage;

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-amber-200/70 shadow-soft hover:shadow-joy transition-all duration-500 hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0]/40 flex items-center justify-center p-3 block border-b border-amber-100">
        {/* Main Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isHovered ? hoverImage : primaryImage}
          alt={product.name}
          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-xs"
        />

        {/* Floating Celebration Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFestiveEdit && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
              <Sparkles className="w-3 h-3 text-amber-200" /> Festive Sparkle
            </span>
          )}
          {product.isNewArrival && !product.isFestiveEdit && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
              <Star className="w-3 h-3 fill-white" /> New Arrival
            </span>
          )}
        </div>

        {/* Model Fit Tag floating pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10 transition-opacity duration-300">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md text-white text-[11px] flex items-center justify-between border border-white/10 shadow-md">
            <span className="text-amber-100 truncate">
              Model {product.modelFit.modelName} ({product.modelFit.heightCm}cm)
            </span>
            <span className="text-rose-300 font-semibold ml-1 flex-shrink-0">
              Wears Size {product.modelFit.wearingSize}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Style */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="tracking-wide uppercase text-[10px] font-bold text-amber-800">
              {product.gender} • {product.styleCategory}
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
              Sizes {product.variants[0]?.size}–{product.variants[product.variants.length - 1]?.size}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="group-hover:text-rose-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-stone-600 line-clamp-1 mt-1 font-normal">
            {product.tagline}
          </p>

          {/* Price & Savings */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-xl font-serif font-bold text-stone-900">
              ₹{product.price}
            </span>
            <span className="text-xs text-stone-400 line-through">
              ₹{product.mrp}
            </span>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Chips */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1.5 font-medium">
            <span>Select Size:</span>
            {onOpenFitModal && (
              <button
                type="button"
                onClick={() => onOpenFitModal(product.name)}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-0.5 underline"
              >
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.sku}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`px-2.5 py-1 text-xs rounded-xl font-semibold border transition-all ${
                  selectedSizeIndex === idx
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-amber-50/60 text-stone-700 border-amber-200/80 hover:border-amber-400'
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Quick Order Action */}
        <div className="pt-2 border-t border-amber-100 flex items-center gap-2">
          <a
            href={generateProductOrderUrl({ product, selectedVariant: currentVariant })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
