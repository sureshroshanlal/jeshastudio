import { NextRequest, NextResponse } from 'next/server';
import { parseInstagramCaption } from '@/lib/instagramParser';
import { isSupabaseConfigured, getSupabaseAdmin } from '@/lib/supabase';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * Downloads an image from an external URL and uploads it to Supabase Storage
 * so that temporary Instagram CDN URLs are permanently persisted.
 */
async function persistImageToSupabase(imageUrl: string, index: number): Promise<string> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    if (!res.ok) {
      console.warn(`Could not download image from ${imageUrl}: ${res.statusText}`);
      return imageUrl;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg';
    const safeName = `ig-import-${Date.now()}-${index}${ext}`;

    // Upload to Supabase Storage if configured
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
              return publicUrlData.publicUrl;
            }
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload failed for IG image, falling back to data URL:', storageErr);
      }
    }

    // Fallback: Inline data URL (persists in DB without 404s)
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error(`Error downloading & persisting image ${imageUrl}:`, err);
    return imageUrl;
  }
}

/**
 * Extracts shortcode from Instagram URL
 * e.g. https://www.instagram.com/p/C-0Kz00v1aQ/?igsh=... -> C-0Kz00v1aQ
 */
function extractShortcode(url: string): string | null {
  const match = url.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, caption: manualCaption, mediaUrls: manualMediaUrls } = body;

    let finalCaption = manualCaption || '';
    let rawMediaUrls: string[] = Array.isArray(manualMediaUrls) ? manualMediaUrls : [];
    let sourceMethod = 'manual';

    const igToken = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN;
    const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID;

    // 1. Try Official Instagram / Meta Graph API if Token is configured
    if (url && igToken && igAccountId) {
      try {
        const shortcode = extractShortcode(url);
        // Query user's recent media to match permalink
        const graphUrl = `https://graph.facebook.com/v20.0/${igAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,children{id,media_type,media_url}&limit=50&access_token=${igToken}`;
        const graphRes = await fetch(graphUrl);
        if (graphRes.ok) {
          const graphData = await graphRes.json();
          const items = graphData.data || [];
          const matched = items.find((item: any) =>
            (shortcode && item.permalink?.includes(shortcode)) ||
            (url && item.permalink?.includes(url.split('?')[0]))
          );

          if (matched) {
            sourceMethod = 'meta_graph_api';
            if (matched.caption) finalCaption = matched.caption;
            
            // Gather all image URLs
            if (matched.children && matched.children.data) {
              rawMediaUrls = matched.children.data
                .filter((child: any) => child.media_url)
                .map((child: any) => child.media_url);
            } else if (matched.media_url) {
              rawMediaUrls = [matched.media_url];
            }
          }
        }
      } catch (graphErr) {
        console.warn('Meta Graph API request error:', graphErr);
      }
    }

    // 2. Fallback: If URL provided but no token or Graph API didn't match, attempt public embed / oEmbed scraping
    if (url && rawMediaUrls.length === 0) {
      try {
        const shortcode = extractShortcode(url);
        if (shortcode) {
          // Attempt oEmbed endpoint
          const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
          const oembedRes = await fetch(oembedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          });

          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            if (oembedData.title && !finalCaption) {
              finalCaption = oembedData.title;
            }
            if (oembedData.thumbnail_url) {
              rawMediaUrls = [oembedData.thumbnail_url];
              sourceMethod = 'oembed';
            }
          }
        }
      } catch (oembedErr) {
        console.warn('oEmbed fallback could not fetch media:', oembedErr);
      }
    }

    // If still no caption and no images provided, inform the client to provide them or check URL
    if (!finalCaption && rawMediaUrls.length === 0) {
      return NextResponse.json({
        success: false,
        requiresInput: true,
        message: 'Could not automatically read post. Instagram requires authentication or access token. Please paste the caption and image URL directly, or configure INSTAGRAM_ACCESS_TOKEN.',
      }, { status: 200 });
    }

    // 3. Download all extracted images and upload permanently to Supabase Storage
    const permanentImages: string[] = [];
    for (let i = 0; i < rawMediaUrls.length; i++) {
      const permanentUrl = await persistImageToSupabase(rawMediaUrls[i], i);
      permanentImages.push(permanentUrl);
    }

    // Default fallback image if none were extracted or provided
    if (permanentImages.length === 0) {
      permanentImages.push('https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=85');
    }

    // 4. Intelligently parse the caption into structured product attributes
    const extracted = parseInstagramCaption(finalCaption);

    const generatedSlug = extracted.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `design-${Date.now()}`;

    const structuredProduct: Partial<Product> = {
      id: `prod-ig-${Date.now()}`,
      slug: `${generatedSlug}-${Date.now().toString().slice(-4)}`,
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
      images: permanentImages,
      variants: extracted.variants,
      modelFit: {
        modelName: extracted.gender === 'Boys' ? 'Kabir' : 'Arya',
        heightCm: 118,
        wearingSize: extracted.sizes[0] || '24',
        fitNote: 'Tailored with comfortable ease for all-day celebrations.',
      },
      details: {
        fabric: extracted.fabric,
        lining: extracted.lining,
        stretch: 'Non-stretch',
        softnessScore: 5,
        pockets: '1 Concealed pocket',
        closure: 'Concealed zipper with fabric guard',
        setIncludes: extracted.setIncludes,
        careInstructions: extracted.careInstructions,
      },
    };

    return NextResponse.json({
      success: true,
      sourceMethod,
      extracted,
      product: structuredProduct,
      imagesPersisted: permanentImages.length,
      supabaseConfigured: isSupabaseConfigured(),
    });
  } catch (error) {
    console.error('Error importing from Instagram:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process Instagram import' },
      { status: 500 }
    );
  }
}
