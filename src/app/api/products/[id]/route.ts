import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProductInDb, deleteProductFromDb, updateStockInDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Check if this is a specialized stock update
    if (body.action === 'updateStock' && body.sku && typeof body.stock === 'number') {
      const ok = await updateStockInDb(params.id, body.sku, body.stock);
      if (!ok) {
        return NextResponse.json({ success: false, message: 'Stock update failed' }, { status: 400 });
      }
      const updated = await getProductById(params.id);
      return NextResponse.json({ success: true, product: updated });
    }

    const updated = await updateProductInDb(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProductFromDb(params.id);
    if (!success) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Product deleted from database' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}
