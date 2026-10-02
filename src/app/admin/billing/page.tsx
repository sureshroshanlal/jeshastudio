'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Printer, 
  Download, 
  Share2, 
  MessageCircle, 
  Package, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';
import { generateInvoicePdf, generateShippingLabelPdf } from '@/lib/pdfGenerator';
import { Order } from '@/types';

function BillingShippingContent() {
  const searchParams = useSearchParams();
  const { orders } = useJeshaStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    searchParams.get('orderId') || orders[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'invoice' | 'shipping'>('invoice');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const paramId = searchParams.get('orderId');
    if (paramId) {
      setSelectedOrderId(paramId);
    }
  }, [searchParams]);

  const selectedOrder: Order | undefined = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleDownloadInvoice = async () => {
    if (!selectedOrder) return;
    setIsGenerating(true);
    await generateInvoicePdf(selectedOrder, 'printable-invoice-container');
    setIsGenerating(false);
  };

  const handleDownloadShippingLabel = async () => {
    if (!selectedOrder) return;
    setIsGenerating(true);
    await generateShippingLabelPdf(selectedOrder, 'printable-shipping-container');
    setIsGenerating(false);
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  if (!selectedOrder) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-ivory-300 text-center space-y-4">
        <FileText className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="font-serif text-xl font-bold text-charcoal-900">No Orders Available</h3>
        <p className="text-xs text-charcoal-600">Please create or log an order first in the Orders Desk.</p>
      </div>
    );
  }

  const invoiceDate = new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft no-print">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900">
            Billing, Invoicing &amp; Shipping Desk
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Generate branded GST-ready invoices and courier dispatch labels in printable PDF formats.
          </p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-charcoal-700">Select Order:</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl font-medium text-charcoal-900 focus:outline-none cursor-pointer"
          >
            {orders.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.orderNumber} — {ord.customer.name} (₹{ord.grandTotal})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-300 shadow-soft no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'invoice'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tax Invoice (A4 PDF)</span>
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'shipping'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'bg-ivory-100 text-charcoal-700 hover:bg-ivory-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Shipping Label (4x6 PDF)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'invoice' ? (
            <button
              onClick={handleDownloadInvoice}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download Invoice PDF'}</span>
            </button>
          ) : (
            <button
              onClick={handleDownloadShippingLabel}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download Shipping Label PDF'}</span>
            </button>
          )}

          <button
            onClick={handleBrowserPrint}
            className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* Invoice Document View */}
      {activeTab === 'invoice' && (
        <div className="flex justify-center">
          <div
            id="printable-invoice-container"
            className="printable-area w-full max-w-3xl bg-white p-8 sm:p-12 rounded-3xl border border-ivory-300 shadow-soft text-charcoal-900 space-y-8"
          >
            
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start pb-6 border-b-2 border-charcoal-900">
              <div className="flex items-start gap-3.5">
                <img
                  src="/jesha-logo.jpg"
                  alt="Jesha Studio"
                  className="w-14 h-14 rounded-full object-cover border border-charcoal-300"
                />
                <div>
                  <span className="font-serif text-3xl font-bold tracking-[0.16em] uppercase text-charcoal-900 block leading-none">
                    Jesha Studio
                  </span>
                  <span className="text-[10px] tracking-[0.22em] text-rose-600 uppercase block font-sans font-semibold mt-1">
                    Kids Fashion &bull; Little Style. Big Smiles.
                  </span>
                  <p className="text-[11px] text-charcoal-600 mt-1.5 leading-relaxed">
                    Jesha Studio, Hyderabad, Telangana<br />
                    Tel: +91 99855 31519, +91 85220 91817<br />
                    contact@jeshastudio.com
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-serif font-bold text-xs uppercase tracking-wider mb-2">
                  Tax Invoice
                </span>
                <div className="font-mono text-sm font-bold text-charcoal-900">
                  {selectedOrder.orderNumber}
                </div>
                <div className="text-xs text-charcoal-600 mt-1">Date: {invoiceDate}</div>
                <div className="text-xs text-charcoal-600">Source: {selectedOrder.source}</div>
              </div>
            </div>

            {/* Bill To / Ship To Grid */}
            <div className="grid grid-cols-2 gap-8 py-2 text-xs">
              <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
                <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block mb-1">
                  Customer &amp; Delivery Address:
                </span>
                <strong className="text-sm font-serif font-bold text-charcoal-900 block">
                  {selectedOrder.customer.name}
                </strong>
                <p className="text-charcoal-700 mt-1 leading-relaxed">
                  {selectedOrder.customer.address}<br />
                  {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                </p>
                <p className="mt-2 text-charcoal-600">
                  Phone: <strong>{selectedOrder.customer.phone}</strong>
                </p>
              </div>

              <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-500 block mb-1">
                    Order Logistics &amp; Fit:
                  </span>
                  <p className="text-charcoal-700 leading-relaxed">
                    Payment: <strong>{selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})</strong><br />
                    Courier: <strong>{selectedOrder.courierPartner || 'Express Air'}</strong><br />
                    AWB: <strong>{selectedOrder.awbNumber || 'JS-EXPRESS-992'}</strong>
                  </p>
                </div>
                {selectedOrder.customer.specialNotes && (
                  <p className="text-[11px] text-rose-600 italic bg-white p-1.5 rounded-lg border border-rose-200 mt-2">
                    Note: {selectedOrder.customer.specialNotes}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-charcoal-900 text-charcoal-900 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Design Description</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="py-3">
                      <td className="py-3 px-3 text-charcoal-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <strong className="text-charcoal-900 font-serif block">{item.productName}</strong>
                        <span className="text-[10px] text-charcoal-500">100% Mulmul Cotton Lined Designer Wear</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-charcoal-700">{item.sku}</td>
                      <td className="py-3 px-3 font-bold text-charcoal-800">{item.size}</td>
                      <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-3 text-right">₹{item.unitPrice}</td>
                      <td className="py-3 px-3 text-right font-serif font-bold text-charcoal-900">₹{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Totals */}
            <div className="flex justify-end pt-4 border-t border-charcoal-900">
              <div className="w-72 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Promo Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-charcoal-600">
                  <span>Express Shipping:</span>
                  <span>{selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-charcoal-500 text-[10px]">
                  <span>GST (Inclusive 5%):</span>
                  <span>₹{Math.round(selectedOrder.grandTotal * 0.0476)}</span>
                </div>
                <div className="flex justify-between text-charcoal-900 font-serif font-bold text-lg pt-2 border-t-2 border-charcoal-900">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Bottom Signature & Payment QR preview */}
            <div className="pt-6 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-serif font-bold text-charcoal-900">Thank you for ordering with Jesha Studio!</p>
                <p className="text-[11px] text-charcoal-600">
                  Handcrafted pieces made for childhood joys and family memories.
                </p>
                <p className="text-[10px] text-charcoal-500">
                  UPI ID for inquiries/reorders: <strong>jeshastudio@upi</strong>
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 border border-ivory-300 rounded-xl bg-ivory-50 flex items-center justify-center mx-auto text-charcoal-700">
                  <QrCode className="w-16 h-16 text-charcoal-800" />
                </div>
                <span className="text-[9px] uppercase font-bold text-charcoal-600 block mt-1">
                  UPI Verified Pay
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Shipping Label Document View */}
      {activeTab === 'shipping' && (
        <div className="flex justify-center">
          <div
            id="printable-shipping-container"
            className="printable-area w-full max-w-md bg-white p-6 rounded-3xl border-2 border-charcoal-900 shadow-soft text-charcoal-900 space-y-4"
          >
            
            {/* Label Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-charcoal-900">
              <div>
                <span className="font-serif text-xl font-bold tracking-widest uppercase">
                  JESHA STUDIO
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-charcoal-600">
                  Express Parcel Delivery
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-charcoal-900 text-white text-[10px] font-bold font-mono">
                  {selectedOrder.courierPartner || 'AIR EXPRESS'}
                </span>
              </div>
            </div>

            {/* Barcode Simulator */}
            <div className="p-3 bg-ivory-50 rounded-xl border border-charcoal-300 text-center space-y-1">
              <div className="h-10 bg-[repeating-linear-gradient(90deg,#1F1D1C,#1F1D1C_2px,transparent_2px,transparent_4px,#1F1D1C_4px,#1F1D1C_7px,transparent_7px,transparent_9px)] w-full max-w-[260px] mx-auto opacity-90" />
              <div className="font-mono text-xs font-bold text-charcoal-900 tracking-widest">
                AWB: {selectedOrder.awbNumber || `JS${Date.now().toString().slice(-8)}IN`}
              </div>
            </div>

            {/* Ship To Box */}
            <div className="p-4 rounded-2xl bg-ivory-50 border border-charcoal-400 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">
                Deliver To (Consignee):
              </span>
              <div className="font-serif text-base font-bold text-charcoal-900">
                {selectedOrder.customer.name}
              </div>
              <p className="text-charcoal-800 leading-snug">
                {selectedOrder.customer.address}<br />
                {selectedOrder.customer.city}, {selectedOrder.customer.state}
              </p>
              <div className="font-mono font-bold text-sm text-charcoal-900 pt-1">
                PIN: {selectedOrder.customer.pincode}
              </div>
              <p className="text-charcoal-800 font-semibold pt-0.5">
                Phone: {selectedOrder.customer.phone}
              </p>
            </div>

            {/* Contents & Weight */}
            <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-ivory-100 rounded-xl border border-ivory-300">
              <div>
                <span className="text-charcoal-500 block text-[9px] uppercase font-bold">Order Ref:</span>
                <span className="font-mono font-bold text-charcoal-900">{selectedOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-charcoal-500 block text-[9px] uppercase font-bold">Contents:</span>
                <span className="font-medium text-charcoal-900">Kids Designer Apparels</span>
              </div>
            </div>

            {/* Safety Badges */}
            <div className="flex items-center justify-between text-[10px] text-charcoal-600 pt-1 border-t border-ivory-300">
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                ★ Fragile Baby Wear
              </span>
              <span>•</span>
              <span className="font-medium">Waterproof Packed</span>
              <span>•</span>
              <span className="font-medium">Handle with Care</span>
            </div>

            {/* From Address */}
            <div className="pt-2 border-t border-charcoal-900 text-[10px] text-charcoal-600 leading-snug">
              <strong>From:</strong> Jesha Studio, Hyderabad, Telangana | Tel: +91 99855 31519, +91 85220 91817
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function BillingShippingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-serif">Loading Invoicing &amp; Shipping Desk...</div>}>
      <BillingShippingContent />
    </Suspense>
  );
}
