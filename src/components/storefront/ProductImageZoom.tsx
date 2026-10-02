'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sparkles, 
  Share2, 
  Check, 
  ZoomIn, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye
} from 'lucide-react';

interface ProductImageZoomProps {
  images: string[];
  activeImageIndex: number;
  onImageChange?: (index: number) => void;
  productName: string;
  isFestiveEdit?: boolean;
  styleCategory?: string;
  onShare?: () => void;
  copiedLink?: boolean;
}

export default function ProductImageZoom({
  images,
  activeImageIndex,
  onImageChange,
  productName,
  isFestiveEdit,
  styleCategory,
  onShare,
  copiedLink,
}: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(activeImageIndex);
  const [isLightboxZoomed, setIsLightboxZoomed] = useState(false);

  // Sync lightbox index when activeImageIndex changes
  useEffect(() => {
    setLightboxIndex(activeImageIndex);
  }, [activeImageIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight' && images.length > 1) {
          setLightboxIndex((prev) => (prev + 1) % images.length);
        }
        if (e.key === 'ArrowLeft' && images.length > 1) {
          setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    document.body.style.overflow = '';
  }, [isLightboxOpen, images.length]);

  const currentImage = images[activeImageIndex] || images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85';

  // Smooth mouse movement tracking inside container
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly reset origin to center when leaving
    setZoomPos({ x: 50, y: 50 });
  };

  const openLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex(activeImageIndex);
    setIsLightboxZoomed(false);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIdx = (lightboxIndex + 1) % images.length;
    setLightboxIndex(nextIdx);
    onImageChange?.(nextIdx);
  };

  const prevLightboxImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIdx = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(prevIdx);
    onImageChange?.(prevIdx);
  };

  return (
    <>
      {/* Main Interactive Stage */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openLightbox}
        className="group relative w-full max-w-[460px] h-[460px] sm:h-[540px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0]/50 shadow-soft border border-amber-200/80 flex items-center justify-center p-4 cursor-zoom-in select-none"
        title="Hover to zoom fabric detail • Click to view full screen"
      >
        {/* Inner Zooming Image Layer */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none will-change-transform"
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: isHovered ? 'scale(2.25)' : 'scale(1)',
            transition: isHovered 
              ? 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.05s ease-out' 
              : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform-origin 0.3s ease-out',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={productName}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl drop-shadow-sm select-none"
            draggable={false}
          />
        </div>

        {/* Top Badges (Preserve Pointer-Events None) */}
        <div className={`absolute top-4 left-4 flex flex-col gap-2 pointer-events-none transition-opacity duration-200 ${isHovered ? 'opacity-30' : 'opacity-100'}`}>
          {isFestiveEdit && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> Festive Sparkle
            </span>
          )}
          {styleCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
              {styleCategory}
            </span>
          )}
        </div>

        {/* Top Right Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {/* Fullscreen Expand Button */}
          <button
            type="button"
            onClick={openLightbox}
            className="p-2.5 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            title="Open high-definition view"
          >
            <Maximize2 className="w-4 h-4 text-charcoal-700" />
          </button>

          {/* Share Button */}
          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2.5 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              title="Share this design"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-charcoal-700" />}
            </button>
          )}
        </div>

        {/* Bottom Luxury Inspection Badge */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none transition-all duration-300">
          <div 
            className={`px-3.5 py-1.5 rounded-full backdrop-blur-md text-[11px] font-medium tracking-wide flex items-center gap-2 border shadow-sm transition-all duration-300 ${
              isHovered
                ? 'bg-charcoal-900/85 text-amber-100 border-charcoal-700/60 scale-105'
                : 'bg-white/85 text-charcoal-700 border-amber-200/60 hover:bg-white'
            }`}
          >
            {isHovered ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Inspecting Fabric Detail · 2.25x</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Hover to inspect fabric · Click for full view</span>
                <span className="sm:hidden">Tap for full screen</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-charcoal-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 pointer-events-auto">
            <div className="flex items-center gap-2 text-white">
              <span className="font-serif text-sm sm:text-base font-medium tracking-wide">
                {productName}
              </span>
              {images.length > 1 && (
                <span className="text-xs text-charcoal-400 font-mono">
                  ({lightboxIndex + 1}/{images.length})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxZoomed((prev) => !prev);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isLightboxZoomed 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Toggle 2x Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{isLightboxZoomed ? 'Zoom 2x (Active)' : 'Zoom 2x'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={prevLightboxImage}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/60 hover:bg-charcoal-900 text-white border border-white/10 shadow-xl transition-all z-20 hover:scale-110 active:scale-95 pointer-events-auto"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={nextLightboxImage}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/60 hover:bg-charcoal-900 text-white border border-white/10 shadow-xl transition-all z-20 hover:scale-110 active:scale-95 pointer-events-auto"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Center Stage */}
          <div 
            className="relative w-full max-w-4xl h-[75vh] flex items-center justify-center overflow-hidden pointer-events-auto cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxZoomed((prev) => !prev);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex] || currentImage}
              alt={`${productName} full screen`}
              className={`max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 drop-shadow-2xl select-none ${
                isLightboxZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 hover:scale-[1.02]'
              }`}
              draggable={false}
            />
          </div>

          {/* Bottom Thumbnails Strip inside Lightbox */}
          {images.length > 1 && (
            <div 
              className="absolute bottom-4 inset-x-0 flex justify-center gap-2 overflow-x-auto px-4 z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    onImageChange?.(idx);
                  }}
                  className={`relative w-12 h-16 sm:w-14 sm:h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-charcoal-900/80 flex items-center justify-center ${
                    lightboxIndex === idx
                      ? 'border-rose-400 ring-2 ring-rose-400/50 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
