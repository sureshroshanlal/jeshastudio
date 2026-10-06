'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Eye, 
  Link as LinkIcon, 
  RefreshCw,
  HelpCircle,
  ImageIcon
} from 'lucide-react';

interface TryOnCutoutUploaderProps {
  value?: string;
  slug?: string;
  fallbackImage?: string;
  onChange: (url: string | undefined) => void;
}

export default function TryOnCutoutUploader({
  value,
  slug,
  fallbackImage,
  onChange,
}: TryOnCutoutUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showTip, setShowTip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested slug-based path
  const slugPath = slug ? `/images/cutouts/${slug}.png` : undefined;

  const uploadFile = async (file: File) => {
    setIsProcessing(true);
    try {
      // 1. Try server endpoint
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
        setIsProcessing(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // 2. Resilient Base64 Fallback with transparency preserved
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange(result);
        }
        setIsProcessing(false);
      };
      reader.onerror = () => setIsProcessing(false);
      reader.readAsDataURL(file);
    } catch {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/webp')) {
      uploadFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/50 via-white to-amber-50/50 border border-ivory-300 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs text-charcoal-900 flex items-center gap-1.5">
              <span>Virtual Try-On Transparent Cutout</span>
              <span className="text-[10px] font-sans font-normal text-charcoal-500">(Optional)</span>
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTip(!showTip)}
          className="text-charcoal-400 hover:text-charcoal-700 p-1"
          title="Cutout specifications"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Helpful Guidance */}
      {showTip && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
          <p className="font-semibold">💡 Cutout Best Practices for Kids Wear:</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li><strong>Format:</strong> Transparent PNG or WebP with alpha channel (transparent background).</li>
            <li><strong>Neckline:</strong> Cut away the child&apos;s face/neck so the garment collar sits naturally over the customer&apos;s photo.</li>
            <li><strong>Automatic alternative:</strong> You can also just drop a file named <code className="bg-white/80 px-1 rounded">{slugPath || 'your-product-slug.png'}</code> into <code className="bg-white/80 px-1 rounded">public/images/cutouts/</code>.</li>
          </ul>
        </div>
      )}

      {/* Active Cutout Display OR Upload Area */}
      {value ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white rounded-xl border border-rose-200 shadow-2xs">
          {/* Transparent Checkerboard Preview Stage */}
          <div 
            className="relative w-28 h-32 rounded-xl overflow-hidden border border-ivory-300 flex-shrink-0 flex items-center justify-center shadow-inner"
            style={{
              backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              backgroundColor: '#ffffff',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Virtual Try-On Cutout Preview"
              className="max-w-full max-h-full w-auto h-auto object-contain filter drop-shadow-md"
            />
            <span className="absolute bottom-1 right-1 text-[8px] bg-charcoal-900/75 text-white px-1.5 py-0.5 rounded font-mono">
              Cutout
            </span>
          </div>

          <div className="flex-1 space-y-1.5 text-xs text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Custom Try-On Cutout Active</span>
            </div>
            <p className="text-[11px] text-charcoal-600 truncate max-w-md">
              {value.startsWith('data:') ? 'Inline transparent image data' : value}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-xs rounded-lg bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 font-medium transition-colors"
              >
                Change Cutout
              </button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="px-3 py-1 text-xs rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`p-4 border-2 border-dashed rounded-xl transition-all text-center space-y-2 ${
            isDragging
              ? 'border-rose-500 bg-rose-50/60'
              : 'border-ivory-300 hover:border-rose-300 bg-white/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-2xs">
            {isProcessing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-charcoal-800">
              Drop transparent cutout PNG here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-rose-500 hover:underline font-bold"
              >
                browse
              </button>
            </p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">
              Transparent PNG or WebP with clear neckline
            </p>
          </div>

          {/* Quick Fallback Note & URL Link */}
          <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-charcoal-500">
            {slugPath && (
              <span className="truncate max-w-[240px] text-charcoal-400">
                Default: <code className="text-charcoal-600 font-mono text-[10px]">{slugPath}</code>
              </span>
            )}
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-rose-600 hover:underline flex items-center gap-1 font-medium"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
            </button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2 max-w-md mx-auto pt-2 animate-fade-in">
              <input
                type="url"
                placeholder="https://... or /images/cutouts/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 p-2 text-xs rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none focus:border-rose-400"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800"
              >
                Set URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
