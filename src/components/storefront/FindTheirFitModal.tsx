'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, MessageCircle, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { generateFitAssistanceUrl } from '@/lib/whatsapp';

interface FindTheirFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function FindTheirFitModal({
  isOpen,
  onClose,
  productName,
}: FindTheirFitModalProps) {
  const [age, setAge] = useState<number>(5);
  const [height, setHeight] = useState<number>(110);
  const [build, setBuild] = useState<'Slim' | 'Regular' | 'Chubby/Broad'>('Regular');
  const [preference, setPreference] = useState<'True to Size' | 'Room to Grow'>('True to Size');

  if (!isOpen) return null;

  // Compute recommendation
  const calculateRecommendation = () => {
    let baseSize = '';
    if (age <= 0.5) baseSize = '0-6M';
    else if (age <= 1) baseSize = '6-12M';
    else if (age <= 2) baseSize = '1-2Y';
    else if (age <= 3) baseSize = '2-3Y';
    else if (age <= 4) baseSize = '3-4Y';
    else if (age <= 6) baseSize = '5-6Y';
    else if (age <= 8) baseSize = '7-8Y';
    else if (age <= 10) baseSize = '9-10Y';
    else if (age <= 12) baseSize = '11-12Y';
    else baseSize = '13-14Y';

    let advice = `For a ${age}-year-old child at ${height} cm with a ${build.toLowerCase()} build, our atelier recommends size ${baseSize}.`;
    
    if (preference === 'Room to Grow' || build === 'Chubby/Broad') {
      advice += ` Since you prefer ${preference === 'Room to Grow' ? 'room to grow' : 'a relaxed silhouette for a broader build'}, going one size up gives an airy drape without compromising shoulder fit.`;
    } else {
      advice += ` This gives a tailored silhouette with ample room for twirling, sitting, and active play.`;
    }

    return { size: baseSize, advice };
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
            Find Their Perfect Fit
          </h3>
          <p className="text-xs text-charcoal-600 mt-1">
            Kids grow fast and uniquely. Let us calculate the best size for comfort and longevity.
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Age Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Child’s Age: <span className="text-base font-bold text-rose-500 font-serif">{age} {age === 1 ? 'Year' : 'Years'}</span>
              </label>
            </div>
            <input
              type="range"
              min="0.5"
              max="14"
              step="0.5"
              value={age}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAge(val);
                // Adjust approximate standard height
                setHeight(Math.round(65 + val * 6.5));
              }}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-charcoal-600 mt-1">
              <span>6 Months</span>
              <span>4 Years</span>
              <span>8 Years</span>
              <span>14 Years</span>
            </div>
          </div>

          {/* Height Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                Height: <span className="text-base font-bold text-pistachio-500 font-serif">{height} cm</span>
              </label>
            </div>
            <input
              type="range"
              min="60"
              max="165"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full accent-pistachio-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-charcoal-600 mt-1">
              <span>60 cm (Infant)</span>
              <span>110 cm (~5Y)</span>
              <span>140 cm (~10Y)</span>
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
                  Recommended Atelier Size
                </span>
                <div className="text-xl font-serif font-bold text-rose-500 mt-0.5">
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
              href={generateFitAssistanceUrl(productName, age, height, build)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Still unsure? Chat with our Stylist on WhatsApp</span>
            </a>
            <p className="text-[11px] text-center text-charcoal-600 mt-2">
              Our tailoring team will review child photos/measurements &amp; confirm before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
