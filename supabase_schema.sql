-- ==============================================================================
-- JESHA STUDIO - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    gender TEXT NOT NULL, -- 'Girls', 'Boys', 'Unisex'
    style_category TEXT NOT NULL, -- 'Western', 'Indian', 'Indo-western'
    age_groups JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. ["3-5", "6-9"]
    occasions JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. ["Festive", "Birthday"]
    price NUMERIC NOT NULL,
    mrp NUMERIC NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_festive_edit BOOLEAN NOT NULL DEFAULT false,
    images JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of photo URLs
    try_on_cutout TEXT, -- Virtual Try-On transparent PNG cutout URL
    variants JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of SizeVariant objects
    model_fit JSONB NOT NULL DEFAULT '{}'::jsonb, -- ModelFitInfo object
    details JSONB NOT NULL DEFAULT '{}'::jsonb, -- ProductDetails object
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure try_on_cutout exists if table was already created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS try_on_cutout TEXT;


-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL DEFAULT 'Direct Website', -- 'WhatsApp', 'Direct Website', 'Walk-in'
    customer JSONB NOT NULL DEFAULT '{}'::jsonb, -- CustomerDetails object
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of OrderItem objects
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    shipping_fee NUMERIC NOT NULL DEFAULT 0,
    grand_total NUMERIC NOT NULL DEFAULT 0,
    order_status TEXT NOT NULL DEFAULT 'Inquiry', -- 'Inquiry', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'
    payment_status TEXT NOT NULL DEFAULT 'Pending UPI', -- 'Paid', 'Advance Paid', 'Pending UPI', 'Cash on Delivery'
    payment_method TEXT NOT NULL DEFAULT 'UPI', -- 'UPI', 'Bank Transfer', 'Cash', 'Card'
    awb_number TEXT,
    courier_partner TEXT,
    invoice_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for Fast Storefront Filtering
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_style ON public.products(style_category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_festive ON public.products(is_festive_edit);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Define Public RLS Policies
-- Anyone can view products (Storefront browsing)
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Anyone can insert / update products (or restrict to service role / anon)
CREATE POLICY "Allow anon insert products" 
ON public.products FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon update products" 
ON public.products FOR UPDATE USING (true);

CREATE POLICY "Allow anon delete products" 
ON public.products FOR DELETE USING (true);

-- Orders: Public can view and create orders
CREATE POLICY "Allow select orders" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update orders" 
ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow delete orders" 
ON public.orders FOR DELETE USING (true);

-- 6. Storage Bucket for High-Resolution Product Photography
-- Insert 'product-images' bucket into storage.buckets if not already existing
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to product-images bucket
CREATE POLICY "Public Access to Product Images" 
ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow uploads to product-images bucket
CREATE POLICY "Allow Public Uploads to Product Images" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow Public Delete on Product Images" 
ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
