'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  RotateCcw, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  FlipHorizontal, 
  Download, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  Sliders, 
  Eye, 
  Layers, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, SizeVariant } from '@/types';
import { generateTryOnOrderUrl } from '@/lib/whatsapp';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct: Product;
  allProducts: Product[];
  initialVariant?: SizeVariant;
}

interface SampleMuse {
  id: string;
  name: string;
  title: string;
  src: string;
  recommendedGender: 'Girls' | 'Boys' | 'Unisex';
}

const SAMPLE_MUSES: SampleMuse[] = [
  {
    id: 'arya',
    name: 'Arya',
    title: 'Girl Muse (128 cm)',
    src: '/images/hero_twirl_organza.jpg',
    recommendedGender: 'Girls',
  },
  {
    id: 'kabir',
    name: 'Kabir',
    title: 'Boy Muse (110 cm)',
    src: '/images/hero_bundi_boy.jpg',
    recommendedGender: 'Boys',
  },
  {
    id: 'meera',
    name: 'Meera',
    title: 'Toddler Muse (98 cm)',
    src: '/images/hero_smock_girl.jpg',
    recommendedGender: 'Girls',
  },
];

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  initialProduct,
  allProducts,
  initialVariant,
}: VirtualTryOnModalProps) {
  // Active product & variant state
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [selectedVariant, setSelectedVariant] = useState<SizeVariant>(
    initialVariant || initialProduct.variants[0]
  );

  // Background / Child Photo State
  const [photoSourceType, setPhotoSourceType] = useState<'sample' | 'custom'>('sample');
  const [activeMuseId, setActiveMuseId] = useState<string>('arya');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  // Garment Transform State
  const [garmentPos, setGarmentPos] = useState<{ x: number; y: number }>({ x: 0, y: 40 });
  const [garmentScale, setGarmentScale] = useState<number>(1.0);
  const [garmentRotation, setGarmentRotation] = useState<number>(0); // in degrees
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [garmentOpacity, setGarmentOpacity] = useState<number>(1.0); // 0.3 - 1.0 for alignment mode

  // UI state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [posStart, setPosStart] = useState<{ x: number; y: number }>({ x: 0, y: 40 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'controls' | 'outfits'>('controls');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const garmentImageRef = useRef<HTMLImageElement | null>(null);

  // Sync initialProduct when opened or changed
  useEffect(() => {
    if (isOpen) {
      setActiveProduct(initialProduct);
      setSelectedVariant(initialVariant || initialProduct.variants[0]);
      // Set appropriate sample muse if custom photo not loaded
      if (!customPhotoUrl) {
        if (initialProduct.gender === 'Boys') {
          setActiveMuseId('kabir');
        } else {
          setActiveMuseId('arya');
        }
      }
    }
  }, [isOpen, initialProduct, initialVariant, customPhotoUrl]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (customPhotoUrl && customPhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(customPhotoUrl);
      }
    };
  }, [customPhotoUrl]);

  // Determine current background image source
  const currentBgSrc = photoSourceType === 'custom' && customPhotoUrl
    ? customPhotoUrl
    : SAMPLE_MUSES.find((m) => m.id === activeMuseId)?.src || SAMPLE_MUSES[0].src;

  // Determine garment cutout URL
  const currentGarmentSrc = activeProduct.tryOnCutout 
    || `/images/cutouts/${activeProduct.slug}.png`
    || activeProduct.images[0];

  // Draw on Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background (Child photo or sample muse)
    const bgImg = bgImageRef.current;
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      // Draw background covering the canvas (aspect cover)
      const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
      const canvasRatio = width / height;

      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (imgRatio > canvasRatio) {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) / 2;
      }

      ctx.save();
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      // Fallback elegant background
      ctx.fillStyle = '#FAF5EE';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Garment Cutout Overlay
    const garmentImg = garmentImageRef.current;
    if (garmentImg && garmentImg.complete && garmentImg.naturalWidth > 0) {
      ctx.save();

      // Move to garment center position
      const centerX = width / 2 + garmentPos.x;
      const centerY = height / 2 + garmentPos.y;

      ctx.translate(centerX, centerY);

      // Apply rotation
      ctx.rotate((garmentRotation * Math.PI) / 180);

      // Apply horizontal flip
      if (isFlipped) {
        ctx.scale(-1, 1);
      }

      // Apply opacity
      ctx.globalAlpha = garmentOpacity;

      // Base target size: garment default width ~ 68% of canvas width
      const baseWidth = width * 0.68 * garmentScale;
      const aspect = garmentImg.naturalHeight / garmentImg.naturalWidth;
      const baseHeight = baseWidth * aspect;

      // Draw subtle shadow for natural 3D depth
      ctx.shadowColor = 'rgba(40, 24, 18, 0.22)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.shadowOffsetX = 0;

      ctx.drawImage(
        garmentImg,
        -baseWidth / 2,
        -baseHeight / 2,
        baseWidth,
        baseHeight
      );

      ctx.restore();
    }
  }, [garmentPos, garmentScale, garmentRotation, isFlipped, garmentOpacity]);

  // Load Background Image
  useEffect(() => {
    if (!isOpen) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = currentBgSrc;
    img.onload = () => {
      bgImageRef.current = img;
      drawCanvas();
    };
  }, [currentBgSrc, isOpen, drawCanvas]);

  // Load Garment Cutout Image
  useEffect(() => {
    if (!isOpen) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = currentGarmentSrc;
    img.onload = () => {
      garmentImageRef.current = img;
      drawCanvas();
    };
    img.onerror = () => {
      // If cutout fails, fallback to primary product image
      if (currentGarmentSrc !== activeProduct.images[0]) {
        const fallbackImg = new window.Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.src = activeProduct.images[0];
        fallbackImg.onload = () => {
          garmentImageRef.current = fallbackImg;
          drawCanvas();
        };
      }
    };
  }, [currentGarmentSrc, activeProduct, isOpen, drawCanvas]);

  // Re-draw when transforms change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Pointer / Mouse / Touch Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPosStart({ x: garmentPos.x, y: garmentPos.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Scale delta relative to canvas visual width vs internal 800px width
    const canvas = canvasRef.current;
    const clientRect = canvas?.getBoundingClientRect();
    const scaleFactor = clientRect ? 800 / clientRect.width : 1;

    setGarmentPos({
      x: Math.round(posStart.x + dx * scaleFactor),
      y: Math.round(posStart.y + dy * scaleFactor),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
    }
  };

  // Reset Garment Position & Scale
  const handleResetTransforms = () => {
    setGarmentPos({ x: 0, y: 40 });
    setGarmentScale(1.0);
    setGarmentRotation(0);
    setIsFlipped(false);
    setGarmentOpacity(1.0);
  };

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous blob url if exists
    if (customPhotoUrl && customPhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(customPhotoUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setCustomPhotoUrl(newUrl);
    setPhotoSourceType('custom');
  };

  // Clear Custom Photo
  const handleClearCustomPhoto = () => {
    if (customPhotoUrl && customPhotoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(customPhotoUrl);
    }
    setCustomPhotoUrl(null);
    setPhotoSourceType('sample');
  };

  // Save Snapshot / Web Share
  const handleSaveSnapshot = async () => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas) return;

    setIsExporting(true);

    try {
      // Create high-res composite export canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1200;
      exportCanvas.height = 1500;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw main canvas scaled to export
      ctx.drawImage(mainCanvas, 0, 0, 1200, 1500);

      // 2. Draw Luxury Jesha Studio Watermark Card at Bottom
      const barHeight = 160;
      const barY = 1500 - barHeight;

      // Translucent blurred dark-amber gradient footer
      const gradient = ctx.createLinearGradient(0, barY - 40, 0, 1500);
      gradient.addColorStop(0, 'rgba(26, 20, 18, 0)');
      gradient.addColorStop(0.3, 'rgba(26, 20, 18, 0.85)');
      gradient.addColorStop(1, 'rgba(26, 20, 18, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, barY - 40, 1200, barHeight + 40);

      // Brand Title
      ctx.font = '600 38px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('🌸 Jesha Studio', 60, barY + 60);

      // Brand Subtitle
      ctx.font = '400 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#E8DCCF';
      ctx.fillText('Little Style. Big Smiles. • Virtual Try-On', 60, barY + 100);

      // Outfit Tagline (Right side)
      ctx.font = '600 28px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#F472B6'; // Rose accent
      ctx.textAlign = 'right';
      ctx.fillText(activeProduct.name, 1140, barY + 58);

      ctx.font = '400 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Size ${selectedVariant.size} • ₹${selectedVariant.price}`, 1140, barY + 98);

      // Reset text align
      ctx.textAlign = 'left';

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E11D48', '#FB7185', '#F59E0B', '#10B981'],
      });

      // Export to blob
      exportCanvas.toBlob(async (blob) => {
        if (!blob) return;

        const filename = `jesha-tryon-${activeProduct.slug}-size${selectedVariant.size}.png`;

        // Check if Web Share API with files is supported (mobile iOS/Android)
        if (
          navigator.canShare &&
          navigator.canShare({ files: [new File([blob], filename, { type: 'image/png' })] })
        ) {
          try {
            const shareFile = new File([blob], filename, { type: 'image/png' });
            await navigator.share({
              title: `Jesha Studio Try-On: ${activeProduct.name}`,
              text: `Check out how this ${activeProduct.name} looks on my child! ✨`,
              files: [shareFile],
            });
            setIsExporting(false);
            return;
          } catch {
            // Fall back to standard download if user cancelled share sheet
          }
        }

        // Standard Desktop / Browser Download
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
        setIsExporting(false);
      }, 'image/png', 0.95);
    } catch {
      setIsExporting(false);
    }
  };

  // WhatsApp Order URL
  const whatsAppUrl = generateTryOnOrderUrl({
    product: activeProduct,
    selectedVariant,
    childNote: photoSourceType === 'custom' ? 'Custom child photo tried' : `Previewed with Muse ${activeMuseId}`,
  });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-charcoal-900/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#FFFDF9] rounded-3xl shadow-2xl border border-ivory-300 text-charcoal-800 overflow-hidden flex flex-col my-auto max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-rose-100/90 via-ivory-100 to-amber-100/90 px-4 sm:px-6 py-3.5 border-b border-ivory-300 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 leading-tight">
                  Virtual Try-On Studio
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                  AR Paper-Doll
                </span>
              </div>
              <p className="text-[11px] text-charcoal-600 hidden sm:block">
                Drag, scale, and adjust silhouettes directly onto your child with zero server upload.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="p-2 rounded-full hover:bg-white/80 text-charcoal-600 hover:text-rose-500 transition-colors"
              title="How Try-On works"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-charcoal-700 hover:text-charcoal-900 transition-colors shadow-sm"
              aria-label="Close Try-On Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DPDP & Parental Privacy Guarantee Banner */}
        <div className="bg-emerald-50/90 px-4 py-1.5 border-b border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 flex-shrink-0">
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>100% In-Browser Privacy:</strong> Child photos are processed strictly in your device local RAM and are <u>never</u> uploaded or stored on any server.
            </span>
          </div>
        </div>

        {/* How It Works Mini Banner (Toggleable) */}
        {showGuide && (
          <div className="bg-amber-50 px-4 sm:px-6 py-2.5 border-b border-amber-200/70 text-xs text-amber-900 flex items-start gap-3 animate-fade-in flex-shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-charcoal-900">How to get the perfect try-on in seconds:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-charcoal-700 text-[11px]">
                <li><strong>Child Photo:</strong> Upload a photo of your child standing straight facing the camera, or choose a sample muse.</li>
                <li><strong>Drag to Place:</strong> Click/touch and drag directly on the canvas to place the outfit over the shoulders.</li>
                <li><strong>Fine-Tune:</strong> Use the Scale and Tilt sliders to match shoulder width and pose.</li>
                <li><strong>Save &amp; Share:</strong> Save a beautiful snapshot with watermark or order on WhatsApp!</li>
              </ol>
            </div>
            <button onClick={() => setShowGuide(false)} className="text-amber-700 hover:text-amber-900 text-xs font-semibold">
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Main Content: Split Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Canvas Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Child Photo Selector Tabs */}
            <div className="w-full flex items-center justify-between bg-white/80 p-1.5 rounded-2xl border border-ivory-300 shadow-sm mb-3">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-charcoal-600 px-2 hidden sm:inline">Model:</span>
                {SAMPLE_MUSES.map((muse) => (
                  <button
                    key={muse.id}
                    onClick={() => {
                      setActiveMuseId(muse.id);
                      setPhotoSourceType('sample');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                      photoSourceType === 'sample' && activeMuseId === muse.id
                        ? 'bg-charcoal-900 text-white shadow-sm'
                        : 'text-charcoal-700 hover:bg-ivory-100'
                    }`}
                  >
                    {muse.name} ({muse.recommendedGender})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="child-photo-input"
                />

                {customPhotoUrl ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPhotoSourceType('custom')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        photoSourceType === 'custom'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      Child&apos;s Photo
                    </button>
                    <button
                      onClick={handleClearCustomPhoto}
                      className="p-1 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50"
                      title="Remove uploaded photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Child</span>
                  </button>
                )}
              </div>
            </div>

            {/* Canvas Container with Direct Interaction */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-ivory-100 rounded-3xl overflow-hidden shadow-xl border-2 border-ivory-300 select-none group touch-none">
              
              <canvas
                ref={canvasRef}
                width={800}
                height={1000}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`w-full h-full object-contain ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              />

              {/* Floating Canvas Badges */}
              <div className="absolute top-3 left-3 bg-charcoal-900/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <Move className="w-3 h-3 text-rose-300" />
                <span>Drag outfit to reposition</span>
              </div>

              {/* Quick Canvas Reset in Top Right */}
              <button
                onClick={handleResetTransforms}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-charcoal-700 p-2 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                title="Reset outfit placement"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Bottom Watermark Overlay for Live View */}
              <div className="absolute bottom-3 left-3 right-3 bg-charcoal-900/60 backdrop-blur-md rounded-2xl px-3 py-1.5 text-white flex items-center justify-between text-[11px] pointer-events-none">
                <span className="font-serif font-semibold text-rose-200 truncate">
                  🌸 {activeProduct.name}
                </span>
                <span className="text-[10px] text-ivory-300 font-mono flex-shrink-0">
                  Size {selectedVariant.size}
                </span>
              </div>
            </div>

            {/* Mobile / Tablet Quick Hint */}
            <p className="text-[11px] text-charcoal-600 mt-2 text-center">
              💡 Touch and drag the dress directly on the image to align it with your child&apos;s shoulders.
            </p>
          </div>

          {/* Right Column: Interactive Studio Controls & Outfits */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Outfit Info Pill */}
            <div className="p-4 rounded-2xl bg-white border border-ivory-300 shadow-soft space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                    {activeProduct.gender} • {activeProduct.styleCategory}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-snug">
                    {activeProduct.name}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-serif font-bold text-lg text-charcoal-900">
                    ₹{selectedVariant.price}
                  </div>
                  <div className="text-[11px] text-charcoal-600 line-through">
                    ₹{selectedVariant.mrp}
                  </div>
                </div>
              </div>

              {/* Size Selector Inside Try-On */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-charcoal-700">
                    Select Size: <span className="font-bold text-rose-600">{selectedVariant.size}</span>
                  </label>
                  <span className="text-[10px] text-charcoal-600">
                    Sizes 16 to 40 (Chest {selectedVariant.chestCm ? `${selectedVariant.chestCm} cm` : 'Standard'})
                  </span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {activeProduct.variants.map((v) => {
                    const isSelected = selectedVariant.sku === v.sku;
                    return (
                      <button
                        key={v.sku}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold flex-shrink-0 transition-all ${
                          isSelected
                            ? 'bg-charcoal-900 text-white shadow-sm'
                            : 'bg-ivory-100 text-charcoal-700 hover:bg-rose-50 hover:text-rose-600 border border-ivory-300'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Tabs: Controls vs Switch Outfits */}
            <div className="flex border-b border-ivory-300">
              <button
                onClick={() => setActiveTab('controls')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'controls'
                    ? 'border-rose-500 text-rose-600 bg-rose-50/30'
                    : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Fit &amp; Scale Controls</span>
              </button>

              <button
                onClick={() => setActiveTab('outfits')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'outfits'
                    ? 'border-rose-500 text-rose-600 bg-rose-50/30'
                    : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Swap Outfits ({allProducts.length})</span>
              </button>
            </div>

            {/* Tab 1: Fit & Scale Manual Controls */}
            {activeTab === 'controls' && (
              <div className="space-y-4 p-4 rounded-2xl bg-white border border-ivory-300 shadow-soft animate-fade-in">
                
                {/* Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-rose-500" /> Garment Scale
                    </span>
                    <span className="font-mono text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {Math.round(garmentScale * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGarmentScale((s) => Math.max(0.4, Number((s - 0.05).toFixed(2))))}
                      className="p-1.5 rounded-lg bg-ivory-100 hover:bg-ivory-200 text-charcoal-700"
                      title="Decrease size"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min={0.4}
                      max={2.0}
                      step={0.02}
                      value={garmentScale}
                      onChange={(e) => setGarmentScale(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 h-2 bg-ivory-200 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={() => setGarmentScale((s) => Math.min(2.0, Number((s + 0.05).toFixed(2))))}
                      className="p-1.5 rounded-lg bg-ivory-100 hover:bg-ivory-200 text-charcoal-700"
                      title="Increase size"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rotation Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-500" /> Tilt &amp; Angle
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {garmentRotation}°
                      </span>
                      {garmentRotation !== 0 && (
                        <button
                          onClick={() => setGarmentRotation(0)}
                          className="text-[10px] text-charcoal-600 hover:text-charcoal-900 underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={-40}
                    max={40}
                    step={1}
                    value={garmentRotation}
                    onChange={(e) => setGarmentRotation(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-ivory-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Quick Toggle Buttons: Flip Horizontal & Alignment Opacity */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isFlipped
                        ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                        : 'bg-ivory-100 border-ivory-300 text-charcoal-700 hover:bg-ivory-200'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>Flip Horizontal</span>
                  </button>

                  <button
                    onClick={() => setGarmentOpacity((o) => (o < 1 ? 1.0 : 0.65))}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      garmentOpacity < 1
                        ? 'bg-pistachio-50 border-pistachio-300 text-pistachio-700 shadow-sm'
                        : 'bg-ivory-100 border-ivory-300 text-charcoal-700 hover:bg-ivory-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{garmentOpacity < 1 ? 'Solid Mode' : 'Collar Align Mode'}</span>
                  </button>
                </div>

                {/* Reset Placement */}
                <div className="flex justify-between items-center pt-1 border-t border-ivory-200 text-xs">
                  <span className="text-charcoal-600">Want to start over?</span>
                  <button
                    onClick={handleResetTransforms}
                    className="text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset All Adjustments
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Outfits Rail (Instant Outfit Switcher) */}
            {activeTab === 'outfits' && (
              <div className="p-3 rounded-2xl bg-white border border-ivory-300 shadow-soft max-h-[290px] overflow-y-auto space-y-2 animate-fade-in no-scrollbar">
                <span className="text-[10px] uppercase font-bold text-charcoal-600 block px-1">
                  Click any piece to preview on child:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allProducts.map((p) => {
                    const isCurrent = p.id === activeProduct.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveProduct(p);
                          setSelectedVariant(p.variants[0]);
                        }}
                        className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isCurrent
                            ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                            : 'bg-ivory-50 border-ivory-200 hover:border-ivory-400 hover:bg-white'
                        }`}
                      >
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-ivory-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          {isCurrent && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-charcoal-600 font-medium block">
                            {p.gender}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-charcoal-900 truncate">
                            {p.name}
                          </h4>
                          <span className="text-xs font-bold text-rose-600">
                            ₹{p.price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons: Save Snapshot & WhatsApp Order */}
            <div className="space-y-2.5 pt-2">
              
              {/* WhatsApp Order Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-serif text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order this Look on WhatsApp (₹{selectedVariant.price})</span>
              </a>

              {/* Save Snapshot Button */}
              <button
                onClick={handleSaveSnapshot}
                disabled={isExporting}
                className="w-full py-3 px-5 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering High-Res Snapshot...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Save Snapshot (With Watermark)</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-charcoal-600">
                Snapshots include our signature Jesha watermark to share with grandparents and family on WhatsApp!
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
