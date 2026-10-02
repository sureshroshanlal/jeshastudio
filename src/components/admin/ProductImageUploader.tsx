'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Link as LinkIcon, X, Star, Plus, Check, ImageIcon, AlertCircle, Sparkles } from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert file to Base64 (fallback or pre-upload)
  const processFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_DIM = 1200;
          if (width > height && width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
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
    } catch (e) {
      console.warn('Server upload failed, falling back to local optimized data URL:', e);
    }
    // Fallback to local Base64
    return await processFileToBase64(file);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const fileList = Array.from(files);
      const imageFiles = fileList.filter((f) => f.type.startsWith('image/'));
      
      const newUrls = await Promise.all(
        imageFiles.map((file) => uploadFileToServer(file))
      );

      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error('Error handling files:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([selected, ...remaining]);
  };

  return (
    <div className="space-y-4">
      {/* Tab switch */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-rose-500" />
          <span>Product Photography Gallery ({images.length} added)</span>
        </label>

        <div className="flex items-center gap-1 bg-amber-50/80 p-1 rounded-xl border border-amber-200/70 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeMode === 'upload' ? 'bg-white shadow-sm text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload Photos
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeMode === 'url' ? 'bg-white shadow-sm text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* Upload Box Mode */}
      {activeMode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-500 bg-rose-50/70 scale-[1.01]'
              : 'border-amber-300/80 hover:border-rose-400 bg-amber-50/40 hover:bg-rose-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-charcoal-900">
                {isProcessing ? 'Saving & Optimizing Photos to Database...' : 'Click to Browse or Drag & Drop Photos'}
              </p>
              <p className="text-[11px] text-charcoal-600 mt-0.5">
                PNG, JPG, WEBP • Saves permanently to backend storage &amp; generates instant responsive web previews
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Paste direct image URL (https://...)..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
            className="flex-1 p-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:outline-none focus:border-rose-400"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
          >
            Add Image Link
          </button>
        </div>
      )}

      {/* Uploaded Gallery Grid with Primary Selection */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EE] flex items-center justify-center p-1.5 transition-all ${
                idx === 0 ? 'border-rose-500 shadow-md ring-2 ring-rose-200' : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Photo ${idx + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl"
              />

              {/* Cover badge */}
              {idx === 0 ? (
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                  <Star className="w-3 h-3 fill-white" /> Cover
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-stone-900/80 hover:bg-stone-900 text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Make this the primary cover photo"
                >
                  Set as Cover
                </button>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="absolute bottom-2 right-2 bg-stone-900/70 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
