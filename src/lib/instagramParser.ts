import { Gender, StyleCategory, Occasion, SizeVariant, Product } from '@/types';

// Standard numeric garment sizes supported by Jesha Studio
export const VALID_JESHA_SIZES = [
  '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'
];

export interface ExtractedInstagramProduct {
  name: string;
  tagline: string;
  description: string;
  gender: Gender;
  styleCategory: StyleCategory;
  occasions: Occasion[];
  price: number;
  mrp: number;
  sizes: string[];
  variants: SizeVariant[];
  fabric: string;
  lining: string;
  setIncludes: string;
  careInstructions: string[];
  rawCaption: string;
}

/**
 * Intelligently extracts product specifications from an unstructured Instagram post caption.
 * Handles Indian ethnic wear conventions, pricing notations (Rs, ₹, INR), and numeric sizing (16-40).
 */
export function parseInstagramCaption(caption: string): ExtractedInstagramProduct {
  if (!caption || typeof caption !== 'string') {
    return getDefaultProduct('');
  }

  const lines = caption
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Extract Price & MRP
  let price = 0;
  let mrp = 0;

  // Search patterns like: "Price: Rs. 2490", "₹1,999", "Price - 2499/-", "INR 3200", "MRP: 3499"
  const mrpRegex = /(?:mrp|original\s*price|retail\s*price)[\s:/-]*(?:rs\.?|₹|inr)?\s*([0-9,]+)/i;
  const mrpMatch = caption.match(mrpRegex);
  if (mrpMatch) {
    mrp = parseInt(mrpMatch[1].replace(/,/g, ''), 10) || 0;
  }

  const priceRegex = /(?:price|offer\s*price|special\s*price|rate|cost)?[\s:/-]*(?:rs\.?|₹|inr)\s*([0-9,]+)(?:\s*\/-)?/i;
  const priceMatch = caption.match(priceRegex);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ''), 10) || 0;
  } else {
    // Look for standalone numbers with currency symbol anywhere
    const altMatch = caption.match(/(?:rs\.?|₹|inr)\s*([0-9,]+)/i);
    if (altMatch) {
      price = parseInt(altMatch[1].replace(/,/g, ''), 10) || 0;
    }
  }

  // Fallbacks if only one was found
  if (price > 0 && mrp === 0) {
    mrp = Math.round(price * 1.25); // estimate realistic 20-25% MRP
  } else if (mrp > 0 && price === 0) {
    price = mrp;
    mrp = Math.round(price * 1.25);
  }

  // Default fallback if no price in caption
  if (price === 0) {
    price = 1490;
    mrp = 1990;
  }

  // 2. Extract Sizes (numeric 16 to 40)
  const detectedSizes: string[] = [];

  // Check for range patterns: "Sizes: 20 to 32" or "20-32" or "Sizes 20-30"
  const rangeMatch = caption.match(/sizes?[\s:/-]*(\d{2})\s*(?:to|-)\s*(\d{2})/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (!isNaN(start) && !isNaN(end) && start < end) {
      for (let s = start; s <= end; s += 2) {
        const sStr = s.toString();
        if (VALID_JESHA_SIZES.includes(sStr) && !detectedSizes.includes(sStr)) {
          detectedSizes.push(sStr);
        }
      }
    }
  }

  // Check for comma/space separated sizes: "Sizes: 18, 20, 22, 24" or "Size : 22 24 26"
  const listMatch = caption.match(/sizes?[\s:/-]*([0-9\s,]+)/i);
  if (listMatch) {
    const rawTokens = listMatch[1].split(/[\s,]+/);
    for (const token of rawTokens) {
      const cleanToken = token.trim();
      if (VALID_JESHA_SIZES.includes(cleanToken) && !detectedSizes.includes(cleanToken)) {
        detectedSizes.push(cleanToken);
      }
    }
  }

  // General scan across entire text for valid numbers if list didn't hit
  if (detectedSizes.length === 0) {
    for (const validSize of VALID_JESHA_SIZES) {
      const regex = new RegExp(`\\b${validSize}\\b`);
      if (regex.test(caption) && !detectedSizes.includes(validSize)) {
        detectedSizes.push(validSize);
      }
    }
  }

  // Default sizes if none specified in post
  const finalSizes = detectedSizes.length > 0 ? detectedSizes.sort((a, b) => parseInt(a) - parseInt(b)) : ['22', '24', '26', '28'];

  // 3. Extract Title / Name
  // Typically the first or second line, stripped of decorative emojis and hashtag signs
  let name = '';
  for (const line of lines) {
    const cleanLine = line
      .replace(/[✨🌟🌸👗🧵🎀💖🔥🎉🌿👑]/g, '')
      .replace(/#\w+/g, '')
      .trim();

    if (cleanLine.length > 3 && !cleanLine.toLowerCase().startsWith('price') && !cleanLine.toLowerCase().startsWith('size')) {
      name = cleanLine;
      break;
    }
  }
  if (!name) {
    name = 'Atelier Handcrafted Ensemble';
  }

  // Capitalize title properly
  name = name.slice(0, 65).trim();

  // 4. Extract Category, Gender & Occasion
  const lowerCaption = caption.toLowerCase();
  
  let gender: Gender = 'Girls';
  if (lowerCaption.includes('boy') || lowerCaption.includes('kurta pyjama') || lowerCaption.includes('bandhgala') || lowerCaption.includes('sherwani') || lowerCaption.includes('nehru jacket')) {
    gender = 'Boys';
  } else if (lowerCaption.includes('unisex') || lowerCaption.includes('sibling matching') || lowerCaption.includes('coord set')) {
    gender = 'Unisex';
  }

  let styleCategory: StyleCategory = 'Indian';
  if (lowerCaption.includes('western') || lowerCaption.includes('party dress') || lowerCaption.includes('frock') || lowerCaption.includes('tutu')) {
    styleCategory = 'Western';
  } else if (lowerCaption.includes('indo-western') || lowerCaption.includes('indowestern') || lowerCaption.includes('dhoti set') || lowerCaption.includes('crop top')) {
    styleCategory = 'Indo-western';
  }

  const occasions: Occasion[] = ['Festive'];
  if (lowerCaption.includes('wedding') || lowerCaption.includes('mehendi') || lowerCaption.includes('sangeet') || lowerCaption.includes('haldi')) {
    occasions.push('Wedding');
  }
  if (lowerCaption.includes('birthday') || lowerCaption.includes('celebration')) {
    occasions.push('Birthday');
  }
  if (lowerCaption.includes('everyday') || lowerCaption.includes('casual') || lowerCaption.includes('play')) {
    occasions.push('Everyday');
  }

  // 5. Extract Fabric, Lining, and Craft Details
  let fabric = '100% Breathable Pure Handloom Cotton';
  if (lowerCaption.includes('organza')) fabric = 'Pure Lightweight Silk Organza';
  else if (lowerCaption.includes('chanderi')) fabric = 'Handcrafted Chanderi Silk with Zari Border';
  else if (lowerCaption.includes('mulmul')) fabric = 'Feather-soft Mulmul Cotton';
  else if (lowerCaption.includes('silk')) fabric = 'Lustrous Pure Silk Blend';
  else if (lowerCaption.includes('georgette')) fabric = 'Fluid Flowing Georgette';
  else if (lowerCaption.includes('linen')) fabric = 'Breathable Pure Linen';
  else if (lowerCaption.includes('velvet')) fabric = 'Plush Royal Velvet';

  const lining = '100% Soft Butter Mulmul Cotton Lining';

  let setIncludes = '1 Outfit Piece';
  if (lowerCaption.includes('anarkali') || lowerCaption.includes('kurta set') || lowerCaption.includes('dupatta')) {
    setIncludes = '1 Kurta / Anarkali with Matching Bottoms';
  } else if (lowerCaption.includes('lehenga')) {
    setIncludes = '1 Choli, 1 Twirl Lehenga, 1 Net/Mulmul Dupatta';
  } else if (lowerCaption.includes('coord') || lowerCaption.includes('co-ord')) {
    setIncludes = '1 Top & 1 Trousers Set';
  }

  // 6. Clean Description
  // Filter out DM invitations, phone numbers, website links, hashtags
  const cleanDescriptionLines = lines.filter((l) => {
    const low = l.toLowerCase();
    return (
      !low.includes('dm to order') &&
      !low.includes('dm for price') &&
      !low.includes('tap link in bio') &&
      !low.includes('link in bio') &&
      !low.includes('whatsapp') &&
      !low.includes('+91') &&
      !low.startsWith('#')
    );
  });

  const description = cleanDescriptionLines
    .slice(1, 6)
    .join(' ')
    .replace(/#\w+/g, '')
    .trim() || `Handcrafted ${styleCategory.toLowerCase()} ensemble tailored specifically for comfortable celebration and gentle children's movement.`;

  const tagline = `Handcrafted with ${fabric.split(' ')[0]} and pure softness for celebrations.`;

  // 7. Generate Size Variants
  const variants: SizeVariant[] = finalSizes.map((sizeStr) => {
    const numericSize = parseInt(sizeStr, 10);
    // Approximate chest/length grading for numeric sizes 16-40
    const chestCm = Math.round(44 + (numericSize - 16) * 1.5);
    const waistCm = Math.round(chestCm - 4);
    const lengthCm = Math.round(42 + (numericSize - 16) * 2.2);

    return {
      size: sizeStr,
      sku: `JS-${Date.now().toString().slice(-4)}-${sizeStr}`,
      stock: 6,
      price,
      mrp,
      chestCm,
      waistCm,
      lengthCm,
    };
  });

  return {
    name,
    tagline,
    description,
    gender,
    styleCategory,
    occasions,
    price,
    mrp,
    sizes: finalSizes,
    variants,
    fabric,
    lining,
    setIncludes,
    careInstructions: ['Gentle hand wash cold', 'Dry in shade to preserve natural dyes', 'Warm iron inside out'],
    rawCaption: caption,
  };
}

function getDefaultProduct(caption: string): ExtractedInstagramProduct {
  return {
    name: 'Atelier Handcrafted Ensemble',
    tagline: 'Pure natural fabrics tailored for gentle celebrations',
    description: 'Bespoke childrenswear crafted with breathable fabrics and seamless interior lining.',
    gender: 'Girls',
    styleCategory: 'Indian',
    occasions: ['Festive'],
    price: 1490,
    mrp: 1990,
    sizes: ['22', '24', '26', '28'],
    variants: [
      { size: '22', sku: `JS-${Date.now().toString().slice(-4)}-22`, stock: 5, price: 1490, mrp: 1990, chestCm: 56, waistCm: 52, lengthCm: 58 },
      { size: '24', sku: `JS-${Date.now().toString().slice(-4)}-24`, stock: 5, price: 1490, mrp: 1990, chestCm: 61, waistCm: 56, lengthCm: 66 },
      { size: '26', sku: `JS-${Date.now().toString().slice(-4)}-26`, stock: 5, price: 1490, mrp: 1990, chestCm: 66, waistCm: 60, lengthCm: 74 },
      { size: '28', sku: `JS-${Date.now().toString().slice(-4)}-28`, stock: 5, price: 1490, mrp: 1990, chestCm: 71, waistCm: 64, lengthCm: 82 },
    ],
    fabric: '100% Breathable Pure Handloom Cotton',
    lining: '100% Soft Butter Mulmul Cotton',
    setIncludes: '1 Outfit Ensemble',
    careInstructions: ['Gentle hand wash cold', 'Dry in shade'],
    rawCaption: caption || '',
  };
}
