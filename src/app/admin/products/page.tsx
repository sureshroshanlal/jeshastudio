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
import { Product, SizeVariant, AgeGroup, Gender, StyleCategory, Occasion } from '@/types';
import ProductImageUploader from '@/components/admin/ProductImageUploader';

function ProductsManagementContent() {
  const searchParams = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct } = useJeshaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    tagline: '',
    description: '',
    gender: 'Girls',
    styleCategory: 'Indian',
    ageGroups: ['3-5', '6-9'],
    occasions: ['Festive'],
    price: 1290,
    mrp: 1690,
    featured: false,
    isNewArrival: true,
    isFestiveEdit: false,
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85'],
    variants: [
      { size: '3-4Y', sku: 'JS-NEW-34', stock: 10, price: 1290, mrp: 1690, chestCm: 56, waistCm: 52, lengthCm: 58 },
      { size: '5-6Y', sku: 'JS-NEW-56', stock: 10, price: 1290, mrp: 1690, chestCm: 60, waistCm: 56, lengthCm: 66 },
    ],
    modelFit: {
      modelName: 'Arya',
      modelAge: '6 years',
      heightCm: 118,
      wearingSize: '5-6Y',
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
      ageGroups: ['3-5', '6-9'],
      occasions: ['Festive'],
      price: 1290,
      mrp: 1690,
      featured: false,
      isNewArrival: true,
      isFestiveEdit: false,
      images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85'],
      variants: [
        { size: '3-4Y', sku: `JS-${Date.now().toString().slice(-4)}-34`, stock: 8, price: 1290, mrp: 1690, chestCm: 56, waistCm: 52, lengthCm: 58 },
        { size: '5-6Y', sku: `JS-${Date.now().toString().slice(-4)}-56`, stock: 10, price: 1290, mrp: 1690, chestCm: 60, waistCm: 56, lengthCm: 66 },
      ],
      modelFit: {
        modelName: 'Arya',
        modelAge: '6 years',
        heightCm: 118,
        wearingSize: '5-6Y',
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
    if (confirm(`Are you sure you want to delete "${name}" from the atelier catalog?`)) {
      deleteProduct(id);
    }
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

  const handleAddVariant = () => {
    const newVariant: SizeVariant = {
      size: '7-8Y',
      sku: `JS-${Date.now().toString().slice(-4)}-78`,
      stock: 5,
      price: formData.price || 1290,
      mrp: formData.mrp || 1690,
      chestCm: 64,
      waistCm: 60,
      lengthCm: 74,
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant],
    }));
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

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Design</span>
        </button>
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
                <th className="py-3 px-4">Ages</th>
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
                        <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-ivory-100 flex-shrink-0 border border-ivory-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=200&q=80'}
                            alt={p.name}
                            className="w-full h-full object-cover"
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
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-charcoal-800">{p.gender}</span>
                      <span className="block text-[10px] text-charcoal-600">{p.styleCategory}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-charcoal-800">{p.ageGroups.join(', ')} Y</span>
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
                        {p.modelFit.modelName} ({p.modelFit.modelAge})
                      </span>
                      <span className="text-[10px] text-charcoal-600">
                        {p.modelFit.heightCm}cm • Wears {p.modelFit.wearingSize}
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
                  {editingProductId ? 'Edit Atelier Design' : 'Create New Atelier Design'}
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
              <div className="space-y-3">
                <ProductImageUploader
                  images={formData.images || []}
                  onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
                />
              </div>

              {/* Section 3: Size Variants & Live Stock Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-ivory-200 pb-1">
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">
                    3. Size Variants &amp; Stock Count
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.variants || []).map((v, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 p-2.5 bg-ivory-50 rounded-xl border border-ivory-200">
                      <input
                        type="text"
                        placeholder="Size (e.g. 5-6Y)"
                        value={v.size}
                        onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                        className="w-20 p-1.5 rounded-lg border border-ivory-300 bg-white font-semibold text-center"
                      />
                      <input
                        type="text"
                        placeholder="SKU"
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                        className="w-28 p-1.5 rounded-lg border border-ivory-300 bg-white"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-charcoal-600">Stock:</span>
                        <input
                          type="number"
                          placeholder="Stock"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value) || 0)}
                          className="w-16 p-1.5 rounded-lg border border-ivory-300 bg-white text-center font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-charcoal-600">Chest:</span>
                        <input
                          type="number"
                          placeholder="Chest cm"
                          value={v.chestCm || ''}
                          onChange={(e) => handleVariantChange(idx, 'chestCm', parseInt(e.target.value) || 0)}
                          className="w-16 p-1.5 rounded-lg border border-ivory-300 bg-white text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-charcoal-600">Length:</span>
                        <input
                          type="number"
                          placeholder="Len cm"
                          value={v.lengthCm || ''}
                          onChange={(e) => handleVariantChange(idx, 'lengthCm', parseInt(e.target.value) || 0)}
                          className="w-16 p-1.5 rounded-lg border border-ivory-300 bg-white text-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: See the Fit Model Specs */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-pistachio-500" />
                  <span>4. &apos;See the Fit&apos; Model Photography Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                    <label className="block text-charcoal-700 font-semibold mb-1">Model Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 8 years"
                      value={formData.modelFit?.modelAge}
                      onChange={(e) => setFormData({
                        ...formData,
                        modelFit: { ...formData.modelFit!, modelAge: e.target.value }
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
                      placeholder="e.g. 7-8Y"
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
