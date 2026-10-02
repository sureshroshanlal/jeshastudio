'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shirt, 
  Boxes, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Printer,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';

export default function AdminDashboardPage() {
  const { products, orders } = useJeshaStore();

  // Metrics computation
  const totalDesigns = products.length;
  const totalStockUnits = products.reduce((sum, p) => 
    sum + p.variants.reduce((vSum, v) => vSum + v.stock, 0), 0);
  
  const totalInventoryValuation = products.reduce((sum, p) => 
    sum + p.variants.reduce((vSum, v) => vSum + (v.stock * v.price), 0), 0);

  const totalSalesValuation = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Low stock variants (stock <= 3)
  const lowStockItems: { product: any; variant: any }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock <= 3) {
        lowStockItems.push({ product: p, variant: v });
      }
    });
  });

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-300 shadow-soft">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-200">
            <Sparkles className="w-3.5 h-3.5" /> Jesha Studio Operations Desk
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Studio Operations &amp; Commerce Desk
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Real-time catalog control, live stock thresholds, WhatsApp order conversion logging, and PDF invoicing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products?action=new"
            className="px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Design</span>
          </Link>
          <Link
            href="/admin/orders?action=new"
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Log WhatsApp Sale</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Stock */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
            <span>Inventory Count</span>
            <div className="w-8 h-8 rounded-xl bg-pistachio-100 text-pistachio-500 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif font-bold text-charcoal-900">{totalStockUnits}</div>
            <p className="text-xs text-charcoal-600 mt-1">Units ready for immediate dispatch</p>
          </div>
          <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs text-pistachio-500 font-medium">
            <span>{totalDesigns} Active Designs</span>
            <Link href="/admin/inventory" className="hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
            <span>Inventory Value</span>
            <div className="w-8 h-8 rounded-xl bg-powder-100 text-powder-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif font-bold text-charcoal-900">
              ₹{totalInventoryValuation.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-charcoal-600 mt-1">Estimated retail stock value</p>
          </div>
          <div className="pt-3 border-t border-ivory-200 text-xs text-charcoal-600">
            Price range: ₹500–₹2,000 / piece
          </div>
        </div>

        {/* Total Orders Logged */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
            <span>Orders &amp; Sales</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif font-bold text-charcoal-900">{orders.length}</div>
            <p className="text-xs text-charcoal-600 mt-1">Total orders registered</p>
          </div>
          <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs text-rose-500 font-medium">
            <span>₹{totalSalesValuation.toLocaleString('en-IN')} logged</span>
            <Link href="/admin/orders" className="hover:underline flex items-center gap-0.5">
              Sales Desk <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
            <span>Stock Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-serif font-bold text-amber-600">{lowStockItems.length}</div>
            <p className="text-xs text-charcoal-600 mt-1">Variants with ≤3 pieces left</p>
          </div>
          <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs text-amber-600 font-medium">
            <span>{lowStockItems.length > 0 ? 'Restock recommended' : 'Healthy Inventory'}</span>
            <Link href="/admin/inventory" className="hover:underline flex items-center gap-0.5">
              Restock <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Grid: Recent Orders & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Desk */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-ivory-300 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                Recent WhatsApp &amp; Studio Sales
              </h3>
              <p className="text-xs text-charcoal-600">Latest customer orders logged in the system</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ivory-200 text-charcoal-600 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-ivory-50">
                    <td className="py-3 px-3 font-semibold text-charcoal-900">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-charcoal-600 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-charcoal-900">{ord.customer.name}</span>
                      <span className="block text-[10px] text-charcoal-600">{ord.customer.phone}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-charcoal-900">
                      ₹{ord.grandTotal}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : ord.orderStatus === 'Dispatched'
                          ? 'bg-blue-100 text-blue-700'
                          : ord.orderStatus === 'Packed'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/billing?orderId=${ord.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ivory-200 hover:bg-rose-100 text-charcoal-800 text-[11px] font-medium"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-ivory-300 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Watchlist</span>
              </h3>
              <p className="text-xs text-charcoal-600">Variants requiring ready-stock replenishment</p>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Adjust
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-600">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              All inventory levels are well-stocked!
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
              {lowStockItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-ivory-50 border border-ivory-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-charcoal-900 truncate">
                      {item.product.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-charcoal-600 mt-0.5">
                      <span>Size: <strong>{item.variant.size}</strong></span>
                      <span>•</span>
                      <span>SKU: {item.variant.sku}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      {item.variant.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
