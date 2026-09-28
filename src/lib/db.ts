import fs from 'fs';
import path from 'path';
import { Product, Order } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './initialData';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and files exist with seed data
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), 'utf-8');
  }
}

// Read products from persistent storage
export function readProducts(): Product[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading products database:', error);
    return INITIAL_PRODUCTS;
  }
}

// Write products to persistent storage
export function writeProducts(products: Product[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing products database:', error);
    throw new Error('Database write failure');
  }
}

// Read orders from persistent storage
export function readOrders(): Order[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading orders database:', error);
    return INITIAL_ORDERS;
  }
}

// Write orders to persistent storage
export function writeOrders(orders: Order[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing orders database:', error);
    throw new Error('Database write failure');
  }
}

// CRUD Operations: Products
export function getAllProducts(): Product[] {
  return readProducts();
}

export function getProductById(idOrSlug: string): Product | undefined {
  const products = readProducts();
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function insertProduct(product: Product): Product {
  const products = readProducts();
  // Ensure unique ID and slug
  const newProduct: Product = {
    ...product,
    id: product.id || `prod-${Date.now()}`,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    createdAt: product.createdAt || new Date().toISOString(),
  };
  const updated = [newProduct, ...products];
  writeProducts(updated);
  return newProduct;
}

export function updateProductInDb(id: string, updates: Partial<Product>): Product | null {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;
  writeProducts(products);
  return updatedProduct;
}

export function deleteProductFromDb(id: string): boolean {
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProducts(filtered);
  return true;
}

export function updateStockInDb(productId: string, sku: string, newStock: number): boolean {
  const products = readProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return false;

  let variantFound = false;
  product.variants = product.variants.map((v) => {
    if (v.sku === sku) {
      variantFound = true;
      return { ...v, stock: Math.max(0, newStock) };
    }
    return v;
  });

  if (!variantFound) return false;
  writeProducts(products);
  return true;
}

// CRUD Operations: Orders
export function getAllOrders(): Order[] {
  return readOrders();
}

export function getOrderById(id: string): Order | undefined {
  const orders = readOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function insertOrder(order: Order): Order {
  const orders = readOrders();
  const products = readProducts();

  // Deduct stock for ordered items
  let productsModified = false;
  const updatedProducts = products.map((p) => {
    let pModified = false;
    const variants = p.variants.map((v) => {
      const match = order.items.find((item) => item.sku === v.sku);
      if (match) {
        pModified = true;
        productsModified = true;
        return { ...v, stock: Math.max(0, v.stock - match.quantity) };
      }
      return v;
    });
    return pModified ? { ...p, variants } : p;
  });

  if (productsModified) {
    writeProducts(updatedProducts);
  }

  const newOrder: Order = {
    ...order,
    id: order.id || `order-${Date.now()}`,
    orderNumber: order.orderNumber || `JS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedOrders = [newOrder, ...orders];
  writeOrders(updatedOrders);
  return newOrder;
}

export function updateOrderInDb(id: string, updates: Partial<Order>): Order | null {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updatedOrder = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updatedOrder;
  writeOrders(orders);
  return updatedOrder;
}

export function deleteOrderFromDb(id: string): boolean {
  const orders = readOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeOrders(filtered);
  return true;
}

export function resetDatabaseToSeed(): { success: boolean; productsCount: number; ordersCount: number } {
  ensureDataDir();
  writeProducts(INITIAL_PRODUCTS);
  writeOrders(INITIAL_ORDERS);
  return {
    success: true,
    productsCount: INITIAL_PRODUCTS.length,
    ordersCount: INITIAL_ORDERS.length,
  };
}
