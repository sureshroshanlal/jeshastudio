'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, Order } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './initialData';

const PRODUCTS_STORAGE_KEY = 'jesha_studio_products_v3';
const ORDERS_STORAGE_KEY = 'jesha_studio_orders_v3';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load products from local cache:', e);
    return [];
  }
}

export function saveStoredProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('jesha_products_updated'));
  } catch (e) {
    console.error('Failed to save products to local cache:', e);
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load orders from local cache:', e);
    return [];
  }
}

export function saveStoredOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('jesha_orders_updated'));
  } catch (e) {
    console.error('Failed to save orders to local cache:', e);
  }
}

export function useJeshaStore() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with Server Database API
  const fetchFromServer = useCallback(async () => {
    try {
      setIsSyncing(true);
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/products').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/orders').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      if (prodRes && prodRes.success && Array.isArray(prodRes.products)) {
        setProducts(prodRes.products);
        saveStoredProducts(prodRes.products);
      } else {
        const local = getStoredProducts();
        if (local.length > 0) setProducts(local);
      }

      if (orderRes && orderRes.success && Array.isArray(orderRes.orders)) {
        setOrders(orderRes.orders);
        saveStoredOrders(orderRes.orders);
      } else {
        const local = getStoredOrders();
        if (local.length > 0) setOrders(local);
      }
    } catch (err) {
      console.error('Error syncing with backend DB:', err);
      const localP = getStoredProducts();
      if (localP.length > 0) setProducts(localP);
      const localO = getStoredOrders();
      if (localO.length > 0) setOrders(localO);
    } finally {
      setIsLoaded(true);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Initial cache check
    const cachedProducts = getStoredProducts();
    const cachedOrders = getStoredOrders();
    if (cachedProducts.length > 0) {
      setProducts(cachedProducts);
    } else {
      setProducts(INITIAL_PRODUCTS);
      saveStoredProducts(INITIAL_PRODUCTS);
    }
    if (cachedOrders.length > 0) {
      setOrders(cachedOrders);
    } else {
      setOrders(INITIAL_ORDERS);
      saveStoredOrders(INITIAL_ORDERS);
    }

    // Fetch live from Database API
    fetchFromServer();

    const handleProductUpdate = () => {
      setProducts(getStoredProducts());
    };

    const handleOrderUpdate = () => {
      setOrders(getStoredOrders());
    };

    window.addEventListener('jesha_products_updated', handleProductUpdate);
    window.addEventListener('jesha_orders_updated', handleOrderUpdate);

    return () => {
      window.removeEventListener('jesha_products_updated', handleProductUpdate);
      window.removeEventListener('jesha_orders_updated', handleOrderUpdate);
    };
  }, [fetchFromServer]);

  // Create Product: Optimistic + Server DB
  const addProduct = async (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveStoredProducts(updated);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const synced = [data.product, ...products.filter((p) => p.id !== newProduct.id)];
          setProducts(synced);
          saveStoredProducts(synced);
        }
      }
    } catch (e) {
      console.error('Failed to save product to server database:', e);
    }
  };

  // Update Product: Optimistic + Server DB
  const updateProduct = async (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(updated);
    saveStoredProducts(updated);

    try {
      await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
    } catch (e) {
      console.error('Failed to update product in server database:', e);
    }
  };

  // Delete Product: Optimistic + Server DB
  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete product from server database:', e);
    }
  };

  // Stock update: Optimistic + Server DB
  const updateStock = async (productId: string, sku: string, newStock: number) => {
    const updated = products.map((p) => {
      if (p.id !== productId) return p;
      const updatedVariants = p.variants.map((v) => {
        if (v.sku === sku) {
          return { ...v, stock: Math.max(0, newStock) };
        }
        return v;
      });
      return { ...p, variants: updatedVariants };
    });
    setProducts(updated);
    saveStoredProducts(updated);

    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStock', sku, stock: newStock }),
      });
    } catch (e) {
      console.error('Failed to update stock in server database:', e);
    }
  };

  // Create Order: Optimistic + Server DB
  const addOrder = async (newOrder: Order) => {
    const currentProducts = getStoredProducts();
    const updatedProducts = currentProducts.map((p) => {
      let productModified = false;
      const updatedVariants = p.variants.map((v) => {
        const matchingItem = newOrder.items.find((item) => item.sku === v.sku);
        if (matchingItem) {
          productModified = true;
          return { ...v, stock: Math.max(0, v.stock - matchingItem.quantity) };
        }
        return v;
      });
      return productModified ? { ...p, variants: updatedVariants } : p;
    });

    saveStoredProducts(updatedProducts);
    setProducts(updatedProducts);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch (e) {
      console.error('Failed to save order to server database:', e);
    }
  };

  // Update Order: Optimistic + Server DB
  const updateOrder = async (updatedOrder: Order) => {
    const updated = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    setOrders(updated);
    saveStoredOrders(updated);

    try {
      await fetch(`/api/orders/${updatedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });
    } catch (e) {
      console.error('Failed to update order in server database:', e);
    }
  };

  // Delete Order: Optimistic + Server DB
  const deleteOrder = async (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    saveStoredOrders(updated);

    try {
      await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Failed to delete order from server database:', e);
    }
  };

  // Manual Reset to Seed Data (explicit admin action only)
  const resetToFactoryDefaults = async () => {
    try {
      await fetch('/api/seed', { method: 'POST' });
    } catch (e) {
      console.error('Server seed reset error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
    }
  };

  return {
    products,
    orders,
    isLoaded,
    isSyncing,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addOrder,
    updateOrder,
    deleteOrder,
    resetToFactoryDefaults,
    refreshData: fetchFromServer,
  };
}
