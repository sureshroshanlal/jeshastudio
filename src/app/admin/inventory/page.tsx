'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Save, 
  Sparkles,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';

export default function InventoryManagementPage() {
  const { products, updateStock } = useJeshaStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Quick adjust
  const handleStockChange = (productId: string, sku: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateStock(productId, sku, newStock);
    showFeedback(`Updated stock for ${sku} to ${newStock}`);
  };

  const handleCustomStockInput = (productId: string, sku: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num)) {
      updateStock(productId, sku, Math.max(0, num));
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  // Flattened variant rows for granular control
  const allRows: { product: any; variant: any }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      allRows.push({ product: p, variant: v });
    });
  });

  const filteredRows = allRows.filter((row) => {
    if (onlyLowStock && row.variant.stock > 3) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = row.product.name.toLowerCase().includes(q);
      const matchSku = row.variant.sku.toLowerCase().includes(q);
      const matchSize = row.variant.size.toLowerCase().includes(q);
      return matchName || matchSku || matchSize;
    }
    return true;
  });

  const totalUnits = allRows.reduce((acc, r) => acc + r.variant.stock, 0);
  const lowStockCount = allRows.filter((r) => r.variant.stock <= 3 && r.variant.stock > 0).length;
  const outOfStockCount = allRows.filter((r) => r.variant.stock === 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-medium animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900">
            Live Inventory &amp; Stock Control
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Instant stock increment/decrement, SKU-level thresholds, and out-of-stock monitoring.
          </p>
        </div>

        {/* Metric pills */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-300 text-charcoal-800">
            {totalUnits} Total Ready Units
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-200 text-amber-700">
            {lowStockCount} Low Stock
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-100 border border-rose-200 text-rose-700">
            {outOfStockCount} Sold Out
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-300 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by SKU, Product Name, or Size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none focus:border-rose-400"
          />
        </div>

        <button
          onClick={() => setOnlyLowStock(!onlyLowStock)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
            onlyLowStock
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-ivory-50 text-charcoal-700 border-ivory-300 hover:border-amber-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Show Low Stock Only (≤3)</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-ivory-300 text-charcoal-600 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Design Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Measurements</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Quick Adjust</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredRows.map((row) => {
                const isOutOfStock = row.variant.stock === 0;
                const isLowStock = row.variant.stock <= 3 && !isOutOfStock;

                return (
                  <tr key={row.variant.sku} className="hover:bg-ivory-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0 border border-ivory-200">
                          <Image
                            src={row.product.images[0] || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=150&q=80'}
                            alt={row.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-semibold text-charcoal-900 block truncate max-w-xs">
                            {row.product.name}
                          </span>
                          <span className="text-[10px] text-charcoal-600">
                            {row.product.gender} • {row.product.styleCategory}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-charcoal-800">
                      {row.variant.sku}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-sm text-charcoal-900">
                      {row.variant.size}
                    </td>

                    <td className="py-3 px-4 text-charcoal-600 text-[11px]">
                      {row.variant.chestCm ? `C: ${row.variant.chestCm}cm` : '—'} • {row.variant.lengthCm ? `L: ${row.variant.lengthCm}cm` : '—'}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-charcoal-900">
                      ₹{row.variant.price}
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={row.variant.stock}
                        onChange={(e) => handleCustomStockInput(row.product.id, row.variant.sku, e.target.value)}
                        className={`w-20 p-1.5 text-center font-bold rounded-xl border ${
                          isOutOfStock
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-white border-ivory-300 text-charcoal-900'
                        }`}
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(row.product.id, row.variant.sku, row.variant.stock, -1)}
                          className="w-8 h-8 rounded-lg bg-ivory-200 hover:bg-rose-100 text-charcoal-800 hover:text-rose-600 flex items-center justify-center font-bold transition-colors"
                          title="Decrease 1 piece"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(row.product.id, row.variant.sku, row.variant.stock, 1)}
                          className="w-8 h-8 rounded-lg bg-ivory-200 hover:bg-emerald-100 text-charcoal-800 hover:text-emerald-700 flex items-center justify-center font-bold transition-colors"
                          title="Increase 1 piece"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(row.product.id, row.variant.sku, row.variant.stock, 5)}
                          className="px-2 py-1.5 rounded-lg bg-ivory-200 hover:bg-pistachio-100 text-charcoal-800 hover:text-pistachio-700 text-[10px] font-semibold transition-colors"
                          title="Add 5 pieces batch"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isOutOfStock ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          Sold Out
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Low Stock ({row.variant.stock})
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                          In Stock ({row.variant.stock})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
