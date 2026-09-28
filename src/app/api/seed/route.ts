import { NextResponse } from 'next/server';
import { resetDatabaseToSeed } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = resetDatabaseToSeed();
    return NextResponse.json({
      ...result,
      message: 'Database reset to initial curated atelier seed data successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
