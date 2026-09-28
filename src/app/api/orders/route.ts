import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, insertOrder } from '@/lib/db';
import { Order } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = getAllOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing order items or customer details' },
        { status: 400 }
      );
    }

    const created = insertOrder(body as Order);
    return NextResponse.json({ success: true, order: created }, { status: 201 });
  } catch (error) {
    console.error('API Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order in database' },
      { status: 500 }
    );
  }
}
