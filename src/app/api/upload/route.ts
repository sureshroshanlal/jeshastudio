import { NextRequest, NextResponse } from 'next/server';
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
    let fallbackBase64Url = '';

    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      buffer = Buffer.from(await file.arrayBuffer());
      ext = file.name.substring(file.name.lastIndexOf('.')) || '.jpg';
      contentType = file.type || 'image/jpeg';
      fallbackBase64Url = `data:${contentType};base64,${buffer.toString('base64')}`;
    } else if (base64Data && typeof base64Data === 'string') {
      const match = base64Data.match(/^data:(image\/([a-zA-Z0-9+]+));base64,(.+)$/);
      if (match) {
        contentType = match[1];
        ext = `.${match[2]}`;
        buffer = Buffer.from(match[3], 'base64');
        fallbackBase64Url = base64Data;
      }
    }

    if (!buffer) {
      return NextResponse.json(
        { success: false, message: 'No valid image file or data provided' },
        { status: 400 }
      );
    }

    const safeName = `jesha-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 1. Try uploading to Supabase Storage 'product-images' bucket
    if (isSupabaseConfigured()) {
      try {
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

            if (publicUrlData && publicUrlData.publicUrl) {
              return NextResponse.json({
                success: true,
                url: publicUrlData.publicUrl,
                storageProvider: 'supabase',
                filename: safeName,
              });
            }
          } else if (error) {
            console.warn('Supabase storage upload error, using resilient data URL:', error.message);
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage exception, using resilient data URL:', storageErr);
      }
    }

    // 2. Try saving to public/uploads directory for fast same-origin serving
    try {
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const localFilePath = path.join(uploadDir, safeName);
      fs.writeFileSync(localFilePath, buffer);
      return NextResponse.json({
        success: true,
        url: `/uploads/${safeName}`,
        storageProvider: 'local-file',
        filename: safeName,
      });
    } catch (localWriteErr) {
      console.warn('Local file write error, falling back to base64 data URL:', localWriteErr);
    }

    // 3. Resilient Fallback: Return optimized inline data URL
    return NextResponse.json({
      success: true,
      url: fallbackBase64Url,
      storageProvider: 'base64',
      filename: safeName,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process image' },
      { status: 500 }
    );
  }
}
