import fs from 'fs';
import path from 'path';
import { Product, Order } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './initialData';
import { isSupabaseConfigured, getSupabaseAdmin } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and files exist with seed data for local fallback
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

// Data Converters between Postgres snake_case and TypeScript camelCase
function rowToProduct(row: any): Product {
  const detailsObj = typeof row.details === 'object' && row.details !== null ? row.details : JSON.parse(row.details || '{}');
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || '',
    description: row.description || '',
    gender: row.gender,
    styleCategory: row.style_category,
    occasions: Array.isArray(row.occasions) ? row.occasions : JSON.parse(row.occasions || '[]'),
    price: Number(row.price),
    mrp: Number(row.mrp),
    featured: Boolean(row.featured),
    isNewArrival: Boolean(row.is_new_arrival),
    isFestiveEdit: Boolean(row.is_festive_edit),
    images: Array.isArray(row.images) ? row.images : JSON.parse(row.images || '[]'),
    tryOnCutout: row.try_on_cutout || detailsObj.tryOnCutout || row.tryOnCutout || undefined,
    variants: Array.isArray(row.variants) ? row.variants : JSON.parse(row.variants || '[]'),
    modelFit: typeof row.model_fit === 'object' && row.model_fit !== null ? row.model_fit : JSON.parse(row.model_fit || '{}'),
    details: detailsObj,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function productToRow(product: Product): any {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    gender: product.gender,
    style_category: product.styleCategory,
    age_groups: [],
    occasions: product.occasions,
    price: product.price,
    mrp: product.mrp,
    featured: product.featured,
    is_new_arrival: product.isNewArrival,
    is_festive_edit: product.isFestiveEdit,
    images: product.images,
    try_on_cutout: product.tryOnCutout || null,
    variants: product.variants,
    model_fit: product.modelFit,
    details: {
      ...(product.details || {}),
      tryOnCutout: product.tryOnCutout || undefined,
    },
    created_at: product.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    source: row.source,
    customer: typeof row.customer === 'object' ? row.customer : JSON.parse(row.customer || '{}'),
    items: Array.isArray(row.items) ? row.items : JSON.parse(row.items || '[]'),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shippingFee: Number(row.shipping_fee),
    grandTotal: Number(row.grand_total),
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    awbNumber: row.awb_number,
    courierPartner: row.courier_partner,
    invoiceUrl: row.invoice_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function orderToRow(order: Order): any {
  return {
    id: order.id,
    order_number: order.orderNumber,
    source: order.source,
    customer: order.customer,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping_fee: order.shippingFee,
    grand_total: order.grandTotal,
    order_status: order.orderStatus,
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    awb_number: order.awbNumber,
    courier_partner: order.courierPartner,
    invoice_url: order.invoiceUrl,
    created_at: order.createdAt,
    updated_at: new Date().toISOString(),
  };
}

// Local File Read/Write Fallbacks
export function readProductsLocal(): Product[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading local products database:', error);
    return INITIAL_PRODUCTS;
  }
}

export function writeProductsLocal(products: Product[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local products database:', error);
  }
}

export function readOrdersLocal(): Order[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading local orders database:', error);
    return INITIAL_ORDERS;
  }
}

export function writeOrdersLocal(orders: Order[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local orders database:', error);
  }
}

// CRUD Operations: Products (Dual Support: Supabase or Local)
export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(rowToProduct);
      }
      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }
    }
  }
  return readProductsLocal();
}

export async function getProductById(idOrSlug: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();
      if (!error && data) {
        return rowToProduct(data);
      }
    }
  }
  const products = readProductsLocal();
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function insertProduct(product: Product): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: product.id || `prod-${Date.now()}`,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    createdAt: product.createdAt || new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row = productToRow(newProduct);
      const { data, error } = await supabase.from('products').insert([row]).select().single();
      if (!error && data) {
        return rowToProduct(data);
      }
      console.error('Supabase product insert error:', error);
    }
  }

  const products = readProductsLocal();
  const updated = [newProduct, ...products];
  writeProductsLocal(updated);
  return newProduct;
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const existing = await getProductById(id);
      if (!existing) return null;
      const merged: Product = { ...existing, ...updates };
      const row = productToRow(merged);
      const { data, error } = await supabase.from('products').update(row).eq('id', id).select().single();
      if (!error && data) {
        return rowToProduct(data);
      }
      console.error('Supabase product update error:', error);
    }
  }

  const products = readProductsLocal();
  const index = products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;
  writeProductsLocal(products);
  return updatedProduct;
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    }
  }

  const products = readProductsLocal();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProductsLocal(filtered);
  return true;
}

export async function updateStockInDb(productId: string, sku: string, newStock: number): Promise<boolean> {
  const product = await getProductById(productId);
  if (!product) return false;

  let variantFound = false;
  const updatedVariants = product.variants.map((v) => {
    if (v.sku === sku) {
      variantFound = true;
      return { ...v, stock: Math.max(0, newStock) };
    }
    return v;
  });

  if (!variantFound) return false;
  const updated = await updateProductInDb(productId, { variants: updatedVariants });
  return Boolean(updated);
}

// CRUD Operations: Orders
export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map(rowToOrder);
      }
    }
  }
  return readOrdersLocal();
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${id},order_number.eq.${id}`)
        .single();
      if (!error && data) {
        return rowToOrder(data);
      }
    }
  }
  const orders = readOrdersLocal();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export async function insertOrder(order: Order): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: order.id || `order-${Date.now()}`,
    orderNumber: order.orderNumber || `JS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Deduct stock for ordered items
  for (const item of newOrder.items) {
    const product = await getProductById(item.productId);
    if (product) {
      const variant = product.variants.find((v) => v.sku === item.sku);
      if (variant) {
        await updateStockInDb(product.id, item.sku, variant.stock - item.quantity);
      }
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const row = orderToRow(newOrder);
      const { data, error } = await supabase.from('orders').insert([row]).select().single();
      if (!error && data) {
        return rowToOrder(data);
      }
      console.error('Supabase order insert error:', error);
    }
  }

  const orders = readOrdersLocal();
  const updatedOrders = [newOrder, ...orders];
  writeOrdersLocal(updatedOrders);
  return newOrder;
}

export async function updateOrderInDb(id: string, updates: Partial<Order>): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const existing = await getOrderById(id);
      if (!existing) return null;
      const merged: Order = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      const row = orderToRow(merged);
      const { data, error } = await supabase.from('orders').update(row).eq('id', id).select().single();
      if (!error && data) {
        return rowToOrder(data);
      }
    }
  }

  const orders = readOrdersLocal();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updatedOrder = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  orders[index] = updatedOrder;
  writeOrdersLocal(orders);
  return updatedOrder;
}

export async function deleteOrderFromDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) return true;
    }
  }

  const orders = readOrdersLocal();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeOrdersLocal(filtered);
  return true;
}

export async function resetDatabaseToSeed(): Promise<{ success: boolean; productsCount: number; ordersCount: number }> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      // Clear existing records
      await supabase.from('products').delete().neq('id', '___');
      await supabase.from('orders').delete().neq('id', '___');

      // Insert initial seed catalog
      const productRows = INITIAL_PRODUCTS.map(productToRow);
      const orderRows = INITIAL_ORDERS.map(orderToRow);

      await supabase.from('products').insert(productRows);
      await supabase.from('orders').insert(orderRows);
    }
  }

  ensureDataDir();
  writeProductsLocal(INITIAL_PRODUCTS);
  writeOrdersLocal(INITIAL_ORDERS);
  return {
    success: true,
    productsCount: INITIAL_PRODUCTS.length,
    ordersCount: INITIAL_ORDERS.length,
  };
}
