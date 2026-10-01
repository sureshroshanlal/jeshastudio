'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, MessageCircle } from 'lucide-react';
import { generateFitAssistanceUrl } from '@/lib/whatsapp';

interface FindTheirFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const AVAILABLE_SIZES = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

export default function FindTheirFitModal({
  isOpen,
  onClose,
  productName,
}: FindTheirFitModalProps) {
  const [chestInches, setChestInches] = useState<number>(24);
  const [height, setHeight] = useState<number>(115);
  const [build, setBuild] = useState<'Slim' | 'Regular' | 'Chubby/Broad'>('Regular');
  const [preference, setPreference] = useState<'True to Size' | 'Room to Grow'>('True to Size');

  if (!isOpen) return null;

  // Compute recommendation based on chest, height, build, and preference
  const calculateRecommendation = () => {
    // Find nearest matching even size in inches (16 to 40)
    let base = Math.round(chestInches / 2) * 2;
    if (base < 16) base = 16;
    if (base > 40) base = 40;

    // Adjust for height disproportion
    if (height > 140 && base < 28) base = 28;
    else if (height > 120 && base < 24) base = 24;
    else if (height > 100 && base < 20) base = 20;

    // Step up for build or room to grow preference
    let recommended = base;
    if ((preference === 'Room to Grow' || build === 'Chubby/Broad') && recommended < 40) {
      recommended = Math.min(40, recommended + 2);
    }

    const chestCm = Math.round(chestInches * 2.54);
    let advice = `For a height of ${height} cm and chest circumference of ${chestInches} inches (${chestCm} cm) with a ${build.toLowerCase()} build, our atelier recommends Size ${recommended}.`;
    
    if (recommended > base) {
      advice += ` We selected Size ${recommended} to accommodate ${preference === 'Room to Grow' ? 'room to grow' : 'a broader silhouette'} with comfortable ease and room for twirling.`;
    } else {
      advice += ` All Jesha pieces include 2–3 cm interior seam margins for custom alterations as your child grows.`;
    }

    return { size: recommended.toString(), advice };
  };

  const recommendation = calculateRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-ivory-50 rounded-3xl shadow-2xl border border-ivory-200 overflow-hidden text-charcoal-800 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-100 via-ivory-100 to-pistachio-100 p-6 border-b border-ivory-200 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal-700 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-rose-500 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-200 shadow-sm">
            <Ruler className="w-3.5 h-3.5" /> Jesha Atelier Size Assistant
          </div>
          <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
            Find Their Perfect Size (16–40)
          </h3>
          <p className="text-xs text-charcoal-600 mt-1">
            Kids of the same age vary widely in size. Select chest and height measurements for a precise, tailor-tested recommendation.
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Chest Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Child’s Chest Measurement: <span className="text-base font-bold text-rose-500 font-serif">{chestInches} in ({Math.round(chestInches * 2.54)} cm)</span>
              </label>
            </div>
            <input
              type="range"
              min="16"
              max="40"
              step="1"
              value={chestInches}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setChestInches(val);
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-charcoal-600 mt-1">
              <span>16 in (Petite)</span>
              <span>24 in (Mid)</span>
              <span>32 in</span>
              <span>40 in (Teen)</span>
            </div>
          </div>

          {/* Height Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Child’s Height: <span className="text-base font-bold text-pistachio-600 font-serif">{height} cm</span>
              </label>
            </div>
            <input
              type="range"
              min="65"
              max="165"
              step="1"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full accent-pistachio-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-charcoal-600 mt-1">
              <span>65 cm</span>
              <span>100 cm</span>
              <span>130 cm</span>
              <span>165 cm</span>
            </div>
          </div>

          {/* Build Options */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
              Child’s Approximate Build
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Slim', 'Regular', 'Chubby/Broad'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBuild(b)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                    build === b
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-white text-charcoal-700 border-ivory-300 hover:border-rose-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-2">
              Fit Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['True to Size', 'Room to Grow'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreference(p)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                    preference === p
                      ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                      : 'bg-white text-charcoal-700 border-ivory-300 hover:border-charcoal-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal-600">
                  Recommended Garment Size
                </span>
                <div className="text-2xl font-serif font-bold text-rose-600 mt-0.5">
                  Size {recommendation.size}
                </div>
                <p className="text-xs text-charcoal-700 mt-1.5 leading-relaxed">
                  {recommendation.advice}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Concierge Option */}
          <div className="pt-2">
            <a
              href={generateFitAssistanceUrl(productName, chestInches, height, build)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Have Questions? Chat with our Stylist on WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-charcoal-600 mt-2">
              Our tailoring team will review child measurements and confirm ideal size before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
