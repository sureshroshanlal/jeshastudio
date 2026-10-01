import { NextRequest, NextResponse } from 'next/server';
import { parseInstagramCaption } from '@/lib/instagramParser';
import { getAllProducts, insertProduct } from '@/lib/db';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

async function persistImageToSupabase(imageUrl: string, safeSuffix: string): Promise<string> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) return imageUrl;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg';
    const safeName = `ig-sync-${Date.now()}-${safeSuffix}${ext}`;

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(`catalog/${safeName}`, buffer, { contentType, upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(`catalog/${safeName}`);

          if (publicUrlData?.publicUrl) return publicUrlData.publicUrl;
        }
      }
    }

    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Image persist error during sync:', err);
    return imageUrl;
  }
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // If CRON_SECRET is set, ensure caller is authorized
      return NextResponse.json({ success: false, message: 'Unauthorized cron request' }, { status: 401 });
    }

    const igToken = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
    const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!igToken || !igAccountId) {
      return NextResponse.json({
        success: false,
        message: 'Instagram Graph API credentials not configured. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID in .env.local',
      }, { status: 400 });
    }

    // 1. Fetch user's latest 25 Instagram media items
    const graphUrl = `https://graph.facebook.com/v20.0/${igAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,children{id,media_type,media_url}&limit=25&access_token=${igToken}`;
    const graphRes = await fetch(graphUrl);
    if (!graphRes.ok) {
      const errorText = await graphRes.text();
      return NextResponse.json({
        success: false,
        message: 'Meta Graph API error',
        details: errorText,
      }, { status: 502 });
    }

    const graphData = await graphRes.json();
    const mediaItems = graphData.data || [];

    // 2. Fetch existing products to avoid duplicating posts
    const existingProducts = await getAllProducts();
    const existingSlugs = new Set(existingProducts.map((p) => p.slug));

    let importedCount = 0;
    let skippedCount = 0;
    const createdProducts: Product[] = [];

    for (const item of mediaItems) {
      const caption = item.caption || '';
      // Skip posts that have no caption or are marked with #notforsale
      if (!caption.trim() || caption.toLowerCase().includes('#notforsale')) {
        skippedCount++;
        continue;
      }

      const extracted = parseInstagramCaption(caption);
      const baseSlug = extracted.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if a product with matching title / slug already exists
      const isAlreadyImported = existingProducts.some(
        (p) => p.slug.startsWith(baseSlug) || p.name.toLowerCase() === extracted.name.toLowerCase()
      );

      if (isAlreadyImported) {
        skippedCount++;
        continue;
      }

      // Collect media URLs
      let mediaUrls: string[] = [];
      if (item.children && item.children.data) {
        mediaUrls = item.children.data
          .filter((c: any) => c.media_url)
          .map((c: any) => c.media_url);
      } else if (item.media_url) {
        mediaUrls = [item.media_url];
      }

      // Persist to Supabase Storage
      const persistedImages: string[] = [];
      for (let i = 0; i < mediaUrls.length; i++) {
        const persisted = await persistImageToSupabase(mediaUrls[i], `${item.id}-${i}`);
        persistedImages.push(persisted);
      }

      if (persistedImages.length === 0) {
        persistedImages.push('https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85');
      }

      const productSlug = `${baseSlug}-${item.id.slice(-6)}`;
      const newProduct: Product = {
        id: `prod-ig-${item.id}`,
        slug: productSlug,
        name: extracted.name,
        tagline: extracted.tagline,
        description: extracted.description,
        gender: extracted.gender,
        styleCategory: extracted.styleCategory,
        occasions: extracted.occasions,
        price: extracted.price,
        mrp: extracted.mrp,
        featured: false,
        isNewArrival: true,
        isFestiveEdit: extracted.occasions.includes('Festive'),
        images: persistedImages,
        variants: extracted.variants,
        modelFit: {
          modelName: extracted.gender === 'Boys' ? 'Kabir' : 'Arya',
          heightCm: 118,
          wearingSize: extracted.sizes[0] || '24',
          fitNote: 'Tailored with comfortable ease for celebrations.',
        },
        details: {
          fabric: extracted.fabric,
          lining: extracted.lining,
          stretch: 'Non-stretch',
          softnessScore: 5,
          pockets: '1 Concealed pocket',
          closure: 'Concealed zipper with fabric shield',
          setIncludes: extracted.setIncludes,
          careInstructions: extracted.careInstructions,
        },
        createdAt: item.timestamp || new Date().toISOString(),
      };

      const saved = await insertProduct(newProduct);
      createdProducts.push(saved);
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      totalChecked: mediaItems.length,
      importedCount,
      skippedCount,
      newProducts: createdProducts.map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
    });
  } catch (error) {
    console.error('Error in automated Instagram sync:', error);
    return NextResponse.json(
      { success: false, message: 'Automated Instagram sync failed' },
      { status: 500 }
    );
  }
}
