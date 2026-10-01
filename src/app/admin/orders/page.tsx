'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  MessageCircle, 
  Printer, 
  Check, 
  X, 
  Clock, 
  Truck, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';
import { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod } from '@/types';

function OrdersManagementContent() {
  const searchParams = useSearchParams();
  const { orders, products, addOrder, updateOrder, deleteOrder } = useJeshaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Order Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [childChest, setChildChest] = useState('');
  const [childHeight, setChildHeight] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [orderSource, setOrderSource] = useState<'WhatsApp' | 'Walk-in' | 'Phone' | 'Direct Website'>('WhatsApp');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [awbNumber, setAwbNumber] = useState('');
  const [courierPartner, setCourierPartner] = useState('DTDC Express');

  // Multi-item cart
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [selectedSku, setSelectedSku] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Open modal if ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (currentProduct && currentProduct.variants.length > 0) {
      setSelectedSku(currentProduct.variants[0].sku);
    }
  }, [selectedProductId, currentProduct]);

  const handleAddItem = () => {
    if (!currentProduct) return;
    const variant = currentProduct.variants.find((v) => v.sku === selectedSku) || currentProduct.variants[0];
    if (!variant) return;

    const newItem: OrderItem = {
      productId: currentProduct.id,
      productName: currentProduct.name,
      productImage: currentProduct.images[0] || '',
      size: variant.size,
      sku: variant.sku,
      quantity: itemQuantity,
      unitPrice: variant.price,
      totalPrice: variant.price * itemQuantity,
    };

    setOrderItems((prev) => [...prev, newItem]);
    setItemQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter customer name and phone number');
      return;
    }
    if (orderItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `JS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      source: orderSource,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress || 'Studio Pickup',
        city: customerCity || 'Local',
        state: customerState || 'India',
        pincode: customerPincode || '000000',
        childChestInches: childChest ? parseFloat(childChest) : undefined,
        childHeightCm: childHeight ? parseInt(childHeight) : undefined,
        specialNotes,
      },
      items: orderItems,
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      orderStatus: 'Confirmed',
      paymentStatus,
      paymentMethod,
      awbNumber: awbNumber || undefined,
      courierPartner: courierPartner || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    setIsModalOpen(false);
    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setOrderItems([]);
    setDiscount(0);
    setSpecialNotes('');
  };

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    updateOrder({
      ...order,
      orderStatus: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.toLowerCase().includes(q);
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      return matchName || matchPhone || matchNum;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-ivory-300 shadow-soft">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900">
            WhatsApp &amp; Studio Sales Desk
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Log orders from WhatsApp customer conversations, track tailoring stages, and trigger instant PDF billing &amp; shipping.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Log New WhatsApp Order</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ivory-300 shadow-soft">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, order #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl focus:outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-charcoal-600 font-medium">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-ivory-50 border border-ivory-300 rounded-xl text-charcoal-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packed">Packed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-ivory-50 border-b border-ivory-300 text-charcoal-600 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer &amp; Fit Notes</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total (₹)</th>
                <th className="py-3 px-4">Order Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-charcoal-900 block text-xs">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-charcoal-600 block mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded bg-ivory-200 text-charcoal-700 text-[9px] font-semibold mt-1">
                      {ord.source}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-charcoal-900 block">{ord.customer.name}</span>
                    <a
                      href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <MessageCircle className="w-3 h-3 fill-emerald-600" />
                      {ord.customer.phone}
                    </a>
                    <span className="text-[10px] text-charcoal-600 block mt-0.5 truncate max-w-xs">
                      {ord.customer.city}, {ord.customer.pincode}
                    </span>
                    {ord.customer.specialNotes && (
                      <span className="text-[10px] text-rose-600 italic block mt-1 bg-rose-50 p-1 rounded">
                        Note: {ord.customer.specialNotes}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1 max-w-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-ivory-300 text-charcoal-800 text-[10px] flex items-center justify-center font-bold">
                            {item.quantity}
                          </span>
                          <span className="truncate text-charcoal-900 font-medium">
                            {item.productName} ({item.size})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                    <span className="block text-[10px] text-charcoal-600 mt-0.5">{ord.paymentMethod}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-serif font-bold text-sm text-charcoal-900">
                      ₹{ord.grandTotal}
                    </span>
                    {ord.discount > 0 && (
                      <span className="block text-[9px] text-rose-600 font-medium">
                        -₹{ord.discount} disc
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-xl border focus:outline-none cursor-pointer ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : ord.orderStatus === 'Dispatched'
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : ord.orderStatus === 'Packed'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'bg-rose-50 border-rose-300 text-rose-800'
                      }`}
                    >
                      <option value="Inquiry">Inquiry</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/billing?orderId=${ord.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-[11px] font-medium shadow-sm transition-colors"
                        title="Generate Printable PDF Invoice & Label"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Bill / Label</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-ivory-300 max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
            
            <div className="p-6 bg-[#25D366]/10 border-b border-ivory-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900">
                    Log WhatsApp / Direct Sale
                  </h3>
                  <p className="text-xs text-charcoal-600">Enter customer shipping details and ordered pieces.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 rounded-full hover:bg-ivory-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Customer Details */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1">
                  1. Customer &amp; Shipping Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Customer / Parent Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-charcoal-700 font-semibold mb-1">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="House/Flat No, Street, Landmark"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      value={customerState}
                      onChange={(e) => setCustomerState(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 560038"
                      value={customerPincode}
                      onChange={(e) => setCustomerPincode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Order Source</label>
                    <select
                      value={orderSource}
                      onChange={(e) => setOrderSource(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Walk-in">Walk-in Boutique</option>
                      <option value="Phone">Phone Order</option>
                      <option value="Direct Website">Direct Website</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">Special Notes / Tailoring Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Gift wrapped with birthday message, need delivery by Friday"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Add Items to Order */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1">
                  2. Select Items to Add
                </h4>

                <div className="p-3 bg-ivory-50 rounded-2xl border border-ivory-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-charcoal-600 text-[10px] uppercase font-bold mb-1">Product</label>
                      <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full p-2 rounded-xl border border-ivory-300 bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-charcoal-600 text-[10px] uppercase font-bold mb-1">Size &amp; SKU</label>
                      <select
                        value={selectedSku}
                        onChange={(e) => setSelectedSku(e.target.value)}
                        className="w-full p-2 rounded-xl border border-ivory-300 bg-white font-semibold"
                      >
                        {currentProduct?.variants.map((v) => (
                          <option key={v.sku} value={v.sku}>
                            {v.size} ({v.stock} in stock) — ₹{v.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal-700 font-semibold">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 p-1.5 rounded-lg border border-ivory-300 bg-white text-center font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-charcoal-900 text-white rounded-xl text-xs font-semibold hover:bg-charcoal-800 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>

                {/* Added Items List */}
                {orderItems.length > 0 ? (
                  <div className="space-y-2">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-ivory-200">
                        <div>
                          <span className="font-semibold text-charcoal-900">{item.productName}</span>
                          <span className="block text-[11px] text-charcoal-600">
                            Size: {item.size} • Qty: {item.quantity} • ₹{item.unitPrice} each
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-sm text-charcoal-900">₹{item.totalPrice}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-charcoal-600 py-3 bg-ivory-50 rounded-xl">No pieces added yet.</p>
                )}
              </div>

              {/* Payment & Financials */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-charcoal-900 border-b border-ivory-200 pb-1">
                  3. Payment &amp; Total
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Advance Paid">Advance Paid</option>
                      <option value="Pending UPI">Pending UPI</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">Shipping Fee (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-xl border border-ivory-300 bg-ivory-50"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-300 flex items-center justify-between">
                  <span className="font-semibold text-charcoal-800">Grand Total Payable:</span>
                  <span className="text-2xl font-serif font-bold text-charcoal-900">₹{grandTotal}</span>
                </div>
              </div>

              {/* Modal Actions */}
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
                  <span>Register Order &amp; Deduct Stock</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function OrdersManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-serif">Loading Orders Desk...</div>}>
      <OrdersManagementContent />
    </Suspense>
  );
}
