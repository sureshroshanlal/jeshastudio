'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, Order, SizeVariant } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './initialData';

const PRODUCTS_STORAGE_KEY = 'jesha_studio_products_v1';
const ORDERS_STORAGE_KEY = 'jesha_studio_orders_v1';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load products from storage:', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('jesha_products_updated'));
  } catch (e) {
    console.error('Failed to save products to storage:', e);
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load orders from storage:', e);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('jesha_orders_updated'));
  } catch (e) {
    console.error('Failed to save orders to storage:', e);
  }
}

export function useJeshaStore() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = useCallback(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refreshData();

    const handleProductUpdate = () => {
      setProducts(getStoredProducts());
    };

    const handleOrderUpdate = () => {
      setOrders(getStoredOrders());
    };

    window.addEventListener('jesha_products_updated', handleProductUpdate);
    window.addEventListener('jesha_orders_updated', handleOrderUpdate);
    window.addEventListener('storage', refreshData);

    return () => {
      window.removeEventListener('jesha_products_updated', handleProductUpdate);
      window.removeEventListener('jesha_orders_updated', handleOrderUpdate);
      window.removeEventListener('storage', refreshData);
    };
  }, [refreshData]);

  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveStoredProducts(updated);
    setProducts(updated);
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveStoredProducts(updated);
    setProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveStoredProducts(updated);
    setProducts(updated);
  };

  const updateStock = (productId: string, sku: string, newStock: number) => {
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
    saveStoredProducts(updated);
    setProducts(updated);
  };

  const addOrder = (newOrder: Order) => {
    // Also decrement stock for ordered items
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
    const updatedOrders = [newOrder, ...orders];
    saveStoredOrders(updatedOrders);
    setOrders(updatedOrders);
    setProducts(updatedProducts);
  };

  const updateOrder = (updatedOrder: Order) => {
    const updated = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    saveStoredOrders(updated);
    setOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    saveStoredOrders(updated);
    setOrders(updated);
  };

  const resetToFactoryDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      refreshData();
    }
  };

  return {
    products,
    orders,
    isLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addOrder,
    updateOrder,
    deleteOrder,
    resetToFactoryDefaults,
  };
}
