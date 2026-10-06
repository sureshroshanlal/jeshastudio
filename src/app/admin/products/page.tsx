'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  X, 
  Sparkles, 
  Ruler, 
  ImageIcon, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';
import { Product, SizeVariant, Gender, StyleCategory, Occasion, ALL_SIZES } from '@/types';
import { getStandardMeasurement, createSizeVariant } from '@/lib/sizeStandards';
import ProductImageUploader from '@/components/admin/ProductImageUploader';
import TryOnCutoutUploader from '@/components/admin/TryOnCutoutUploader';
import InstagramImportModal from '@/components/admin/InstagramImportModal';

function ProductsManagementContent() {
  const searchParams = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct } = useJeshaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIgModalOpen, setIsIgModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    description: '',
    gender: 'Girls',
    styleCategory: 'Indian',
    occasions: ['Festive'],
    price: 1290,
    mrp: 1690,
    featured: false,
    isNewArrival: true,
    isFestiveEdit: false,
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85'],
    variants: [
      createSizeVariant('22', 1290, 1690, 'JS'),
      createSizeVariant('24', 1290, 1690, 'JS'),
    ],
    modelFit: {
      modelName: 'Arya',
      heightCm: 118,
      wearingSize: '24',
      fitNote: 'Regular comfortable fit with room for movement.',
    },
    details: {
      fabric: '100% Breathable Pure Cotton',
      lining: '100% Butter-soft Mulmul Cotton',
      stretch: 'Non-stretch',
      softnessScore: 5,
      pockets: '1 Hidden side pocket',
      closure: 'Concealed YKK zipper with soft fabric guard',
      setIncludes: '1 Outfit Piece',
      careInstructions: ['Hand wash in cold water', 'Dry in shade'],
    },
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Auto-open modal if ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenNewModal();
    }
  }, [searchParams]);

  const handleOpenNewModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      gender: 'Girls',
      styleCategory: 'Indian',
      occasions: ['Festive'],
      price: 1290,
      mrp: 1690,
      featured: false,
      isNewArrival: true,
      isFestiveEdit: false,
      images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85'],
      tryOnCutout: '',
      variants: [
        createSizeVariant('22', 1290, 1690, 'JS'),
        createSizeVariant('24', 1290, 1690, 'JS'),
      ],
      modelFit: {
        modelName: 'Arya',
        heightCm: 118,
        wearingSize: '24',
        fitNote: 'Tailored with comfortable ease for all-day play.',
      },
      details: {
        fabric: '100% Organic Handloom Cotton',
        lining: '100% Soft Mulmul Lining',
        stretch: 'Non-stretch',
        softnessScore: 5,
        pockets: '1 Concealed pocket',
        closure: 'Concealed zipper with fabric shield',
        setIncludes: '1 Kurta Set',
        careInstructions: ['Gentle wash cold', 'Dry in shade'],
      },
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleDuplicate = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      slug: `${prod.slug}-copy-${Date.now().toString().slice(-4)}`,
      name: `${prod.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    addProduct(duplicated);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the product catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleImportFromInstagram = (importedProduct: Partial<Product>) => {
    setEditingProductId(null);
    setFormData((prev) => ({
      ...prev,
      ...importedProduct,
    }));
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrlInput.trim()],
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddVariant = (preferredSize?: string) => {
    const existingSizes = new Set((formData.variants || []).map((v) => v.size));
    const targetSize = preferredSize || ALL_SIZES.find((s) => !existingSizes.has(s)) || '22';
    
    const newVariant = createSizeVariant(
      targetSize,
      formData.price || 1290,
      formData.mrp || 1690,
      formData.name ? formData.name.slice(0, 3) : 'JS'
    );

    setFormData((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
    }));
  };

  const handleToggleSize = (size: string) => {
    const variants = formData.variants || [];
    const existingIndex = variants.findIndex((v) => v.size === size);
    if (existingIndex >= 0) {
      setFormData((prev) => ({
        ...prev,
        variants: variants.filter((_, i) => i !== existingIndex),
      }));
    } else {
      handleAddVariant(size);
    }
  };

  const handleSizeSelect = (index: number, newSize: string) => {
    const std = getStandardMeasurement(newSize);
    setFormData((prev) => {
      const variants = [...(prev.variants || [])];
      const current = variants[index] || {};
      variants[index] = {
        ...current,
        size: newSize,
        // On selection of size the stock should default to 1:
        stock: 1,
        // Chest and length should auto populate as per the market standards:
        chestCm: std.chestCm,
        lengthCm: std.lengthCm,
        waistCm: std.waistCm,
        sku: current.sku?.replace(/-\d+$/, `-${newSize}`) || `JS-${Date.now().toString().slice(-4)}-${newSize}`,
      };
      return { ...prev, variants };
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof SizeVariant, value: any) => {
    setFormData((prev) => {
      const variants = [...(prev.variants || [])];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in product name and price');
      return;
    }

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingProductId) {
      updateProduct({
        ...formData,
        id: editingProductId,
        slug: formData.slug || slug,
      } as Product);
    } else {
      const newProd: Product = {
        ...formData,
        id: `prod-${Date.now()}`,
        slug: slug || `design-${Date.now()}`,
        createdAt: new Date().toISOString(),
      } as Product;
      addProduct(newProd);
    }

    setIsModalOpen(false);
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    if (filterGender !== 'All' && p.gender !== filterGender) return false;
    if (filterCategory !== 'All' && p.styleCategory !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900">
            Product Catalog &amp; Visual Assets
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Manage designs, multi-angle editorial photography, size matrices, and &apos;See the Fit&apos; model measurements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsIgModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Import from Instagram</span>
          </button>

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Design</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-300 shadow-soft">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none focus:border-rose-400"
            />
          </div>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-3 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl text-charcoal-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Girls">Girls</option>
            <option value="Boys">Boys</option>
            <option value="Unisex">Unisex</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl text-charcoal-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Indian">Indian</option>
            <option value="Indo-western">Indo-western</option>
            <option value="Western">Western</option>
          </select>
        </div>

        <span className="text-xs text-charcoal-600 font-medium">
          {filteredProducts.length} Designs in Catalog
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-ivory-300 text-charcoal-600 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Design &amp; Imagery</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Variants</th>
                <th className="py-3 px-4">Model Fit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-200 flex items-center justify-center p-0.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=200&q=80'}
                            alt={p.name}
                            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-serif font-bold text-sm text-charcoal-900 block truncate">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-charcoal-600 block truncate">{p.tagline}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.isFestiveEdit && (
                              <span className="text-[9px] bg-rose-100 text-rose-600 font-bold px-1.5 py-0.2 rounded">Festive</span>
                            )}
                            {p.isNewArrival && (
                              <span className="text-[9px] bg-pistachio-100 text-pistachio-600 font-bold px-1.5 py-0.2 rounded">New</span>
                            )}
                            {p.tryOnCutout && (
                              <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" /> VTON Cutout
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-charcoal-800">{p.gender}</span>
                      <span className="block text-[10px] text-charcoal-600">{p.styleCategory}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-charcoal-800 font-medium">{p.variants.map((v) => v.size).join(', ')}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-sm text-charcoal-900">₹{p.price}</span>
                      <span className="block text-[10px] text-charcoal-600 line-through">₹{p.mrp}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block font-bold text-xs ${totalStock <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {totalStock} units
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.variants.map((v) => (
                          <span key={v.sku} className="text-[9px] px-1.5 py-0.5 bg-ivory-200 rounded text-charcoal-700">
                            {v.size}: {v.stock}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-charcoal-800 block">
                        {p.modelFit.modelName}
                      </span>
                      <span className="text-[10px] text-charcoal-600">
                        {p.modelFit.heightCm}cm • Size {p.modelFit.wearingSize}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg bg-ivory-200 hover:bg-rose-100 text-charcoal-700 hover:text-rose-600 transition-colors"
                          title="Edit Piece"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg bg-ivory-200 hover:bg-pistachio-100 text-charcoal-700 hover:text-pistachio-600 transition-colors"
                          title="Duplicate Piece"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-ivory-200 hover:bg-rose-100 text-charcoal-700 hover:text-rose-600 transition-colors"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-ivory-300 max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Modal Header */}
            <div className="p-6 bg-ivory-50 border-b border-ivory-300 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  {editingProductId ? 'Edit Design' : 'Create New Design'}
                </h3>
                <p className="text-xs text-charcoal-600">Enter full specifications, images, and model fit measurements.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 rounded-full hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Section 1: Basic Info */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1">
                  1. General Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gulabi Organza Anarkali Set"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Tagline / Short Hook</label>
                    <input
                      type="text"
                      placeholder="e.g. Pure organza twirls with soft mulmul lining"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Detailed Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe craftsmanship, feel, silhouette..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    >
                      <option value="Girls">Girls</option>
                      <option value="Boys">Boys</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Style Category</label>
                    <select
                      value={formData.styleCategory}
                      onChange={(e) => setFormData({ ...formData, styleCategory: e.target.value as StyleCategory })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    >
                      <option value="Indian">Indian</option>
                      <option value="Indo-western">Indo-western</option>
                      <option value="Western">Western</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Visual Assets & Images */}
              <div className="space-y-4">
                <ProductImageUploader
                  images={formData.images || []}
                  onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
                />

                <TryOnCutoutUploader
                  value={formData.tryOnCutout}
                  slug={formData.slug || (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined)}
                  fallbackImage={formData.images?.[0]}
                  onChange={(cutoutUrl) => setFormData((prev) => ({ ...prev, tryOnCutout: cutoutUrl }))}
                />
              </div>

              {/* Section 3: Size Variants & Live Stock Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-1">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-900">
                      3. Size Variants &amp; Stock Count
                    </h4>
                    <p className="text-[11px] text-charcoal-500">
                      Select sizes 16 to 40 (increments of 2). Stock defaults to 1; Chest &amp; Length auto-populate from market standards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddVariant()}
                    className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size Variant
                  </button>
                </div>

                {/* Quick Add / Toggle Size Chips (16 to 40 in increments of 2) */}
                <div className="p-3 bg-ivory-100/70 rounded-2xl border border-ivory-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-charcoal-700">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-rose-500" />
                      Quick Toggle Size (16–40):
                    </span>
                    <span className="text-[10px] text-charcoal-500 font-normal">
                      Click to add/remove with auto-standard measurements
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SIZES.map((sz) => {
                      const isAdded = (formData.variants || []).some((v) => v.size === sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`px-2.5 py-1 text-xs rounded-xl font-bold transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-stone-900 text-white shadow-xs'
                              : 'bg-white hover:bg-ivory-200 text-charcoal-700 border border-ivory-300'
                          }`}
                        >
                          {isAdded && <Check className="w-3 h-3 text-emerald-400" />}
                          <span>{sz}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Variant List Table/Cards */}
                <div className="space-y-2.5">
                  {(formData.variants || []).map((v, idx) => {
                    const std = getStandardMeasurement(v.size);
                    return (
                      <div 
                        key={idx} 
                        className="p-3 bg-white rounded-2xl border border-ivory-300 shadow-2xs space-y-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          
                          {/* Size Dropdown: 16 to 40 in increments of 2 */}
                          <div className="flex flex-col">
                            <label className="text-[10px] text-charcoal-500 font-semibold mb-0.5">Size (16-40)</label>
                            <select
                              value={v.size}
                              onChange={(e) => handleSizeSelect(idx, e.target.value)}
                              className="w-24 p-1.5 rounded-lg border border-ivory-300 bg-ivory-50 font-bold text-charcoal-900 text-xs focus:ring-1 focus:ring-rose-500"
                            >
                              {ALL_SIZES.map((sz) => (
                                <option key={sz} value={sz}>
                                  Size {sz}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* SKU */}
                          <div className="flex flex-col">
                            <label className="text-[10px] text-charcoal-500 font-semibold mb-0.5">SKU</label>
                            <input
                              type="text"
                              placeholder="SKU"
                              value={v.sku}
                              onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                              className="w-28 p-1.5 rounded-lg border border-ivory-300 bg-white text-xs font-mono"
                            />
                          </div>

                          {/* Stock (defaults to 1) */}
                          <div className="flex flex-col">
                            <label className="text-[10px] text-charcoal-500 font-semibold mb-0.5">Stock</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="1"
                              value={v.stock}
                              onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value) || 0)}
                              className="w-16 p-1.5 rounded-lg border border-ivory-300 bg-white text-center font-bold text-xs"
                            />
                          </div>

                          {/* Chest (cm) - Auto-populated */}
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-[10px] text-charcoal-500 font-semibold">Chest (cm)</label>
                            </div>
                            <input
                              type="number"
                              placeholder={`${std.chestCm}`}
                              value={v.chestCm || ''}
                              onChange={(e) => handleVariantChange(idx, 'chestCm', parseInt(e.target.value) || 0)}
                              className="w-20 p-1.5 rounded-lg border border-ivory-300 bg-white text-center text-xs font-medium"
                            />
                          </div>

                          {/* Length (cm) - Auto-populated */}
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-[10px] text-charcoal-500 font-semibold">Length (cm)</label>
                            </div>
                            <input
                              type="number"
                              placeholder={`${std.lengthCm}`}
                              value={v.lengthCm || ''}
                              onChange={(e) => handleVariantChange(idx, 'lengthCm', parseInt(e.target.value) || 0)}
                              className="w-20 p-1.5 rounded-lg border border-ivory-300 bg-white text-center text-xs font-medium"
                            />
                          </div>

                          {/* Remove Variant Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl ml-auto self-end transition-colors"
                            title="Remove variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Standard Measurement Reference Note */}
                        <div className="flex items-center justify-between text-[10px] text-charcoal-500 px-1 pt-1 border-t border-ivory-100">
                          <span>
                            Market Standard for <strong className="text-charcoal-700">Size {v.size}</strong>: Chest ~{std.chestInches}&quot; ({std.chestCm} cm) &bull; Length: {std.lengthCm} cm
                          </span>
                          <span className="text-amber-800 font-medium">
                            Approx: {std.approxAge}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {(formData.variants || []).length === 0 && (
                    <div className="text-center py-6 border border-dashed border-ivory-300 rounded-2xl bg-ivory-50/50">
                      <p className="text-xs text-charcoal-600">No size variants added yet.</p>
                      <button
                        type="button"
                        onClick={() => handleAddVariant('22')}
                        className="mt-2 text-xs font-bold text-rose-600 underline"
                      >
                        Add Default Size (22)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: See the Fit Model Specs */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-pistachio-500" />
                  <span>4. &apos;See the Fit&apos; Model Photography Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Model Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Arya"
                      value={formData.modelFit?.modelName}
                      onChange={(e) => setFormData({
                        ...formData,
                        modelFit: { ...formData.modelFit!, modelName: e.target.value }
                      })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 128"
                      value={formData.modelFit?.heightCm}
                      onChange={(e) => setFormData({
                        ...formData,
                        modelFit: { ...formData.modelFit!, heightCm: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Wearing Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 26"
                      value={formData.modelFit?.wearingSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        modelFit: { ...formData.modelFit!, wearingSize: e.target.value }
                      })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Fit Note for Parents</label>
                  <input
                    type="text"
                    placeholder="e.g. Arya has a slender build, wearing 7-8Y with comfortable room for twirling."
                    value={formData.modelFit?.fitNote}
                    onChange={(e) => setFormData({
                      ...formData,
                      modelFit: { ...formData.modelFit!, fitNote: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50"
                  />
                </div>
              </div>

              {/* Section 5: Fabric & Craftsmanship */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1">
                  5. Fabric, Lining &amp; Craft Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Fabric Composition</label>
                    <input
                      type="text"
                      value={formData.details?.fabric}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details!, fabric: e.target.value }
                      })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Inner Lining</label>
                    <input
                      type="text"
                      value={formData.details?.lining}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: { ...formData.details!, lining: e.target.value }
                      })}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-ivory-300 flex items-center justify-end gap-3 sticky bottom-0 bg-white p-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-ivory-300 text-charcoal-700 hover:bg-ivory-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProductId ? 'Save Changes' : 'Publish Design'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Instagram Import Modal */}
      <InstagramImportModal
        isOpen={isIgModalOpen}
        onClose={() => setIsIgModalOpen(false)}
        onImportProduct={handleImportFromInstagram}
      />

    </div>
  );
}

export default function ProductsManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-serif">Loading Product Catalog...</div>}>
      <ProductsManagementContent />
    </Suspense>
  );
}
