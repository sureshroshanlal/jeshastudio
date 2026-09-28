import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    let buffer: Buffer | null = null;
    let ext = '.jpg';
    let contentType = 'image/jpeg';

    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      buffer = Buffer.from(await file.arrayBuffer());
      ext = path.extname(file.name) || '.jpg';
      contentType = file.type || 'image/jpeg';
    } else if (base64Data && typeof base64Data === 'string') {
      const match = base64Data.match(/^data:(image\/([a-zA-Z0-9]+));base64,(.+)$/);
      if (match) {
        contentType = match[1];
        ext = `.${match[2]}`;
        buffer = Buffer.from(match[3], 'base64');
      }
    }

    if (!buffer) {
      return NextResponse.json(
        { success: false, message: 'No valid image file or base64 data provided' },
        { status: 400 }
      );
    }

    const safeName = `jesha-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 1. If Supabase Storage is configured, upload to Supabase 'product-images' bucket
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(`catalog/${safeName}`, buffer, {
            contentType,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(`catalog/${safeName}`);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storageProvider: 'supabase',
            filename: safeName,
          });
        }
        console.warn('Supabase storage upload error, falling back to disk:', error);
      }
    }

    // 2. Local disk storage fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      storageProvider: 'local',
      filename: safeName,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload and store image' },
      { status: 500 }
    );
  }
}
