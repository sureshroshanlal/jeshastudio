'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Sparkles, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Plus,
  Trash2,
  HelpCircle,
  ClipboardPaste
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
  const [activeTab, setActiveTab] = useState<'quick' | 'url'>('quick');
  const [postUrl, setPostUrl] = useState('');
  const [manualCaption, setManualCaption] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [manualImageUrls, setManualImageUrls] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHelperTips, setShowHelperTips] = useState(false);

  // Result state
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [extractedProduct, setExtractedProduct] = useState<Partial<Product> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload an image file to Supabase Storage via /api/upload
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch (err) {
      console.warn('Direct upload error, falling back to local base64:', err);
    }
    // Fallback: convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection from drag-and-drop or file picker
  const handleFileSelection = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingFile(true);
    setErrorMsg(null);

    try {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      const uploadPromises = imageFiles.map((file) => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      const successful = results.filter((url): url is string => Boolean(url));

      setUploadedImages((prev) => [...prev, ...successful]);
    } catch (err) {
      console.error('Failed to upload selected files:', err);
      setErrorMsg('Failed to process image files.');
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Clipboard paste listener: Allows pressing Ctrl+V anywhere to paste images!
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems: File[] = [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageItems.push(file);
        }
      }

      if (imageItems.length > 0) {
        setIsUploadingFile(true);
        try {
          const results = await Promise.all(imageItems.map((f) => uploadFile(f)));
          const valid = results.filter((u): u is string => Boolean(u));
          setUploadedImages((prev) => [...prev, ...valid]);
        } catch (err) {
          console.error('Clipboard image paste error:', err);
        } finally {
          setIsUploadingFile(false);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFetchFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: postUrl.trim() }),
      });

      const data = await res.json();

      if (data.requiresInput) {
        setActiveTab('quick');
        setErrorMsg('Instagram requires an access token to read this post URL directly. Use the quick tab below: paste the caption and drop or paste your photo!');
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

  const handleParseAndCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCaption.trim()) {
      setErrorMsg('Please enter or paste the Instagram caption.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Combine uploaded files + any pasted URLs
    const pastedUrls = manualImageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    const allMediaUrls = [...uploadedImages, ...pastedUrls];

    try {
      const res = await fetch('/api/instagram/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: manualCaption,
          mediaUrls: allMediaUrls.length > 0 ? allMediaUrls : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        // Ensure our uploaded images are present
        if (allMediaUrls.length > 0) {
          data.product.images = allMediaUrls;
        }
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

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== indexToRemove));
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
    setUploadedImages([]);
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
                  Numeric Sizes 16–40
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Paste caption, drop or paste outfit photos — automatically extracts details and uploads to Supabase.
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
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
                  <span>Open in Product Editor &amp; Publish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // Input Form
            <div className="space-y-4">
              
              {/* Tab Switcher */}
              <div className="flex items-center justify-between">
                <div className="flex items-center p-1 bg-ivory-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quick')}
                    className={`py-1.5 px-3 rounded-lg font-semibold text-xs transition-all ${
                      activeTab === 'quick'
                        ? 'bg-white text-charcoal-900 shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    Quick Caption &amp; Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('url')}
                    className={`py-1.5 px-3 rounded-lg font-semibold text-xs transition-all ${
                      activeTab === 'url'
                        ? 'bg-white text-charcoal-900 shadow-sm'
                        : 'text-charcoal-600 hover:text-charcoal-900'
                    }`}
                  >
                    Import by Post URL
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHelperTips(!showHelperTips)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How to get IG photos?</span>
                </button>
              </div>

              {/* Collapsible Helper Tips on Getting IG Images */}
              {showHelperTips && (
                <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl text-charcoal-800 space-y-2 text-[11px] animate-fade-in">
                  <p className="font-semibold text-rose-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    3 Super Simple Ways to Add Instagram Photos (No API Key Needed):
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-charcoal-700">
                    <li>
                      <strong>Original Photo (Best &amp; Easiest):</strong> If you posted it, you already have the high-res photo on your phone or laptop. Simply <em>drag &amp; drop it below</em> or click &ldquo;Choose Photos&rdquo;!
                    </li>
                    <li>
                      <strong>Paste from Clipboard (Ctrl + V):</strong> Take a screenshot (`Win + Shift + S`) or copy any image, then press <code>Ctrl + V</code> anywhere inside this modal. It uploads to Supabase immediately!
                    </li>
                    <li>
                      <strong>1-Click Free Web Downloader:</strong> Paste the post link into <strong>FastDl.app</strong> or <strong>SnapInsta.app</strong>. It will show the direct JPG image in 1 second—you can copy its link or save it and drop it here.
                    </li>
                  </ol>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {activeTab === 'quick' ? (
                <form onSubmit={handleParseAndCreate} className="space-y-4">
                  {/* Step 1: Caption */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-charcoal-700 font-semibold">
                        1. Paste Instagram Caption *
                      </label>
                      <span className="text-[10px] text-charcoal-400">
                        Extracts Title, Price, Fabric &amp; Sizes 16–40 automatically
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      required
                      placeholder={`Paste the post caption here...\nExample:\nGulabi Organza Anarkali Set ✨\nPure lightweight organza with soft mulmul lining.\nSizes: 20 to 32\nPrice: Rs. 2,490\nIncludes: Anarkali with pants and dupatta\nDM to order! #jesha #ethnicwear`}
                      value={manualCaption}
                      onChange={(e) => setManualCaption(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none text-xs font-mono"
                    />
                  </div>

                  {/* Step 2: Photo Dropzone & Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-charcoal-700 font-semibold">
                        2. Outfit Photos
                      </label>
                      <span className="text-[10px] text-charcoal-500 flex items-center gap-1">
                        <ClipboardPaste className="w-3 h-3 text-rose-500" />
                        <span>Tip: Press <b>Ctrl + V</b> to paste copied images directly</span>
                      </span>
                    </div>

                    {/* Dropzone Box */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-ivory-300 hover:border-rose-400 bg-ivory-50 hover:bg-rose-50/30 rounded-2xl p-4 text-center cursor-pointer transition-colors space-y-1.5"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelection(e.target.files)}
                        className="hidden"
                      />
                      <div className="w-9 h-9 rounded-full bg-white shadow-soft mx-auto flex items-center justify-center text-rose-500">
                        {isUploadingFile ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>
                      <p className="font-semibold text-charcoal-800 text-xs">
                        {isUploadingFile ? 'Uploading photos to Supabase Storage...' : 'Click to Choose Photos or Drag & Drop'}
                      </p>
                      <p className="text-[11px] text-charcoal-500">
                        Supports high-res JPG, PNG, WEBP (Saved permanently to Supabase Storage)
                      </p>
                    </div>

                    {/* Uploaded Images Strip */}
                    {uploadedImages.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-20 rounded-xl overflow-hidden border border-ivory-300 group shadow-sm bg-ivory-100 flex-shrink-0"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Outfit ${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-0 inset-x-0 bg-charcoal-900/70 text-white text-[8px] text-center py-0.5 font-bold">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-20 rounded-xl border border-dashed border-ivory-300 hover:border-rose-400 bg-white flex flex-col items-center justify-center text-charcoal-400 hover:text-rose-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[9px] font-semibold mt-1">Add More</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Optional: Paste Image URLs directly if user already has links */}
                  <div>
                    <label className="block text-charcoal-600 text-[11px] font-medium mb-1">
                      Or paste Image URLs (optional, one per line):
                    </label>
                    <textarea
                      rows={1}
                      placeholder="https://... (CDN or external photo URLs)"
                      value={manualImageUrls}
                      onChange={(e) => setManualImageUrls(e.target.value)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none text-[11px] font-mono"
                    />
                  </div>

                  {/* Actions */}
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
                      disabled={isLoading || isUploadingFile || !manualCaption.trim()}
                      className="px-5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition-transform active:scale-95"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Parsing &amp; Converting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Extract &amp; Create Design</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
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
                      If you have configured `INSTAGRAM_ACCESS_TOKEN` in `.env.local`, this reads the post automatically.
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
                          <span>Fetching...</span>
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
