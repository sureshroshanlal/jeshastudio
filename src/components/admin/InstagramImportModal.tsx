'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Sparkles, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  Layers, 
  ExternalLink, 
  Tag, 
  Scissors,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '@/types';

interface InstagramImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProduct: (productData: Partial<Product>) => void;
}

export default function InstagramImportModal({
  isOpen,
  onClose,
  onImportProduct,
}: InstagramImportModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');
  const [postUrl, setPostUrl] = useState('');
  const [manualCaption, setManualCaption] = useState('');
  const [manualImageUrls, setManualImageUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requiresManual, setRequiresManual] = useState(false);

  // Result state
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [extractedProduct, setExtractedProduct] = useState<Partial<Product> | null>(null);

  if (!isOpen) return null;

  const handleFetchFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setRequiresManual(false);

    try {
      const res = await fetch('/api/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: postUrl.trim() }),
      });

      const data = await res.json();

      if (data.requiresInput) {
        setRequiresManual(true);
        setActiveTab('manual');
        setErrorMsg('Instagram requires login to scrape this post directly. Simply paste the post caption & image link below and we will automatically parse it and upload images to your Supabase DB.');
      } else if (data.success && data.product) {
        setExtractedProduct(data.product);
        setExtractedData(data.extracted);
      } else {
        setErrorMsg(data.message || 'Could not extract product from this link.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to connect to Instagram import service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCaption.trim()) {
      setErrorMsg('Please enter or paste the Instagram caption.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const mediaUrls = manualImageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    try {
      const res = await fetch('/api/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: manualCaption,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setExtractedProduct(data.product);
        setExtractedData(data.extracted);
      } else {
        setErrorMsg(data.message || 'Failed to parse caption.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error processing caption and images.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToCatalog = () => {
    if (extractedProduct) {
      onImportProduct(extractedProduct);
      onClose();
    }
  };

  const handleReset = () => {
    setExtractedProduct(null);
    setExtractedData(null);
    setErrorMsg(null);
    setPostUrl('');
    setManualCaption('');
    setManualImageUrls('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-ivory-300 max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header with Instagram Accent */}
        <div className="p-6 bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-b border-ivory-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Instagram to Store Catalog Sync
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold border border-rose-200">
                  Automated Extraction
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Pulls photos, parses pricing, fabric &amp; numeric sizes (16–40) into your Supabase database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-500 hover:text-charcoal-900 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* If extracted product preview is ready */}
          {extractedProduct ? (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-xs">Product Details &amp; Images Extracted Successfully!</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-charcoal-600 hover:text-charcoal-900 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Start Over
                </button>
              </div>

              {/* Extracted Card Preview */}
              <div className="p-4 rounded-2xl border border-ivory-300 bg-ivory-50/50 space-y-4">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-ivory-200 flex-shrink-0 border border-ivory-300">
                    {extractedProduct.images?.[0] ? (
                      <Image
                        src={extractedProduct.images[0]}
                        alt={extractedProduct.name || 'Preview'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-[9px] px-1.5 py-0.5 bg-charcoal-900/80 text-white rounded">
                      {extractedProduct.images?.length || 1} Photo(s)
                    </span>
                  </div>

                  {/* Key Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
                        {extractedProduct.styleCategory} · {extractedProduct.gender}
                      </span>
                      <h4 className="font-serif text-base font-bold text-charcoal-900 truncate">
                        {extractedProduct.name}
                      </h4>
                      <p className="text-charcoal-600 text-xs line-clamp-2 mt-0.5">
                        {extractedProduct.description}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-lg font-bold text-charcoal-900">
                        ₹{extractedProduct.price?.toLocaleString()}
                      </span>
                      {extractedProduct.mrp && extractedProduct.mrp > (extractedProduct.price || 0) && (
                        <span className="text-xs text-charcoal-400 line-through">
                          ₹{extractedProduct.mrp?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Detected Numeric Sizes */}
                    <div>
                      <span className="text-[10px] font-semibold text-charcoal-600 block mb-1">
                        Detected Garment Sizes (Numeric 16–40):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {extractedProduct.variants?.map((v, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-ivory-300 text-charcoal-800 text-[11px] font-semibold"
                          >
                            Size {v.size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fabric & Craft Details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ivory-200 text-[11px]">
                  <div>
                    <span className="text-charcoal-500 font-medium">Fabric: </span>
                    <span className="text-charcoal-800 font-semibold">{extractedProduct.details?.fabric}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-500 font-medium">Lining: </span>
                    <span className="text-charcoal-800 font-semibold">{extractedProduct.details?.lining}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyToCatalog}
                  className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <span>Review &amp; Publish in Product Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Input Form
            <div className="space-y-4">
              
              {/* Tab Switcher */}
              <div className="flex items-center p-1 bg-ivory-100 rounded-xl max-w-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === 'url'
                      ? 'bg-white text-charcoal-900 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  Import by Post URL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === 'manual'
                      ? 'bg-white text-charcoal-900 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                >
                  Quick Caption &amp; Photos
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {activeTab === 'url' ? (
                <form onSubmit={handleFetchFromUrl} className="space-y-4">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Instagram Post or Reel URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        placeholder="https://www.instagram.com/p/..."
                        value={postUrl}
                        onChange={(e) => setPostUrl(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none pr-10"
                      />
                      <ExternalLink className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      Paste the link of any Jesha Studio post. Our parser will automatically pull images, extract fabric details, detected numeric sizes (16–40), and pricing.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-900 text-[11px] space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Automatic Supabase Storage Upload
                    </p>
                    <p className="text-amber-800">
                      Instagram CDN photo links expire in 24 hours. When importing, the photos are automatically fetched and permanently uploaded to your Supabase Storage bucket (`product-images`).
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 font-medium text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !postUrl.trim()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-semibold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-transform active:scale-95"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Fetching &amp; Uploading Images...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Extract Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleManualParse} className="space-y-4">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Paste Instagram Caption *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder={`Paste the caption text here...\nExample:\nGulabi Organza Anarkali Set ✨\nPure lightweight organza with soft mulmul lining.\nSizes: 20 to 32\nPrice: Rs. 2,490\nIncludes: Anarkali with pants and dupatta\nDM to order! #jesha #ethnicwear`}
                      value={manualCaption}
                      onChange={(e) => setManualCaption(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Image URLs (Optional - One per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://... (CDN or web image URLs to save directly to Supabase)"
                      value={manualImageUrls}
                      onChange={(e) => setManualImageUrls(e.target.value)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none text-xs font-mono"
                    />
                    <p className="text-[11px] text-charcoal-500 mt-1">
                      You can also drop images directly inside the product editor once extracted.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 font-medium text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !manualCaption.trim()}
                      className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-transform active:scale-95"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Parsing &amp; Converting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Parse &amp; Extract Product</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
