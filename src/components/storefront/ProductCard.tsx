'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Ruler, Sparkles, ArrowUpRight } from 'lucide-react';
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
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-ivory-200/90 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-ivory-100 block">
        {/* Main Image */}
        <Image
          src={isHovered ? hoverImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFestiveEdit && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold tracking-wider text-rose-500 uppercase shadow-sm border border-rose-100">
              <Sparkles className="w-3 h-3" /> Festive Edit
            </span>
          )}
          {product.isNewArrival && !product.isFestiveEdit && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold tracking-wider text-pistachio-500 uppercase shadow-sm border border-pistachio-100">
              New Arrival
            </span>
          )}
        </div>

        {/* Model Fit Tag floating pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10 transition-opacity duration-300">
          <div className="px-3 py-1.5 rounded-xl bg-charcoal-900/75 backdrop-blur-md text-white text-[11px] flex items-center justify-between">
            <span className="text-ivory-200 truncate">
              Model {product.modelFit.modelName}: {product.modelFit.modelAge} ({product.modelFit.heightCm}cm)
            </span>
            <span className="text-rose-200 font-medium ml-1 flex-shrink-0">
              Wears {product.modelFit.wearingSize}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Style */}
          <div className="flex items-center justify-between text-xs text-charcoal-600 mb-1.5">
            <span className="tracking-wide uppercase text-[10px] font-semibold text-charcoal-600">
              {product.gender} • {product.styleCategory}
            </span>
            <span className="text-[10px] bg-ivory-200 text-charcoal-700 px-2 py-0.5 rounded-full font-medium">
              {product.ageGroups.join(', ')} Yrs
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="group-hover:text-rose-500 transition-colors">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-charcoal-600 line-clamp-1 mt-1">
            {product.tagline}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-lg font-serif font-bold text-charcoal-900">
              ₹{product.price}
            </span>
            <span className="text-xs text-charcoal-600 line-through">
              ₹{product.mrp}
            </span>
            {discountPercent > 0 && (
              <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Chips */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-charcoal-600 mb-1.5">
            <span>Select Size:</span>
            {onOpenFitModal && (
              <button
                type="button"
                onClick={() => onOpenFitModal(product.name)}
                className="text-rose-500 hover:underline flex items-center gap-0.5"
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
                className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-all ${
                  selectedSizeIndex === idx
                    ? 'bg-charcoal-900 text-white border-charcoal-900'
                    : 'bg-ivory-50 text-charcoal-700 border-ivory-300 hover:border-charcoal-400'
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Order CTA Button */}
        <div className="pt-2 border-t border-ivory-200/80 flex items-center gap-2">
          <a
            href={generateProductOrderUrl({
              product,
              selectedVariant: currentVariant,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </a>

          <Link
            href={`/product/${product.slug}`}
            className="p-2.5 rounded-2xl bg-ivory-100 hover:bg-rose-100 text-charcoal-700 hover:text-rose-500 transition-colors border border-ivory-300"
            title="View Product Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
