import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, insertProduct } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const occasion = searchParams.get('occasion');
    const size = searchParams.get('size');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let products = await getAllProducts();

    if (gender && gender !== 'All') {
      products = products.filter((p) => p.gender === gender || p.gender === 'Unisex');
    }

    if (category && category !== 'All') {
      products = products.filter((p) => p.styleCategory === category);
    }

    if (occasion && occasion !== 'All') {
      products = products.filter((p) => p.occasions.includes(occasion as any));
    }

    if (size && size !== 'All') {
      products = products.filter((p) => p.variants.some((v) => v.size === size));
    }

    if (featured === 'true') {
      products = products.filter((p) => p.featured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.details.fabric.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('API Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, message: 'Missing required product fields (name, price)' },
        { status: 400 }
      );
    }

    const created = await insertProduct(body as Product);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error) {
    console.error('API Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save product to database' },
      { status: 500 }
    );
  }
}
