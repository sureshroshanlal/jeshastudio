import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const safeName = `jesha-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, safeName);
      
      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: safeName,
      });
    }

    if (base64Data && typeof base64Data === 'string') {
      const match = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (match) {
        const ext = `.${match[1]}`;
        const rawBase64 = match[2];
        const buffer = Buffer.from(rawBase64, 'base64');
        const safeName = `jesha-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadsDir, safeName);

        fs.writeFileSync(filePath, buffer);
        const publicUrl = `/uploads/${safeName}`;

        return NextResponse.json({
          success: true,
          url: publicUrl,
          filename: safeName,
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'No valid image file or base64 data provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload and store image' },
      { status: 500 }
    );
  }
}
