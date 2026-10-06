import { ClothSize, ALL_SIZES, SizeVariant } from '@/types';

export interface SizeStandard {
  size: ClothSize;
  chestInches: number;
  chestCm: number;
  lengthCm: number;
  waistCm: number;
  approxAge: string;
}

/**
 * Standard Indian childrenswear measurement chart for numeric sizes 16 to 40 (increments of 2).
 * In the Indian market, size numbers directly correspond to chest circumference in inches.
 */
export const MARKET_SIZE_STANDARDS: Record<ClothSize, SizeStandard> = {
  '16': { size: '16', chestInches: 16.5, chestCm: 42, lengthCm: 36, waistCm: 40, approxAge: '6–12 Months' },
  '18': { size: '18', chestInches: 18.0, chestCm: 46, lengthCm: 44, waistCm: 44, approxAge: '1–2 Years' },
  '20': { size: '20', chestInches: 20.0, chestCm: 51, lengthCm: 52, waistCm: 48, approxAge: '2–3 Years' },
  '22': { size: '22', chestInches: 22.0, chestCm: 56, lengthCm: 60, waistCm: 52, approxAge: '3–4 Years' },
  '24': { size: '24', chestInches: 24.0, chestCm: 61, lengthCm: 68, waistCm: 56, approxAge: '5–6 Years' },
  '26': { size: '26', chestInches: 26.0, chestCm: 66, lengthCm: 76, waistCm: 60, approxAge: '6–7 Years' },
  '28': { size: '28', chestInches: 28.0, chestCm: 71, lengthCm: 84, waistCm: 64, approxAge: '7–8 Years' },
  '30': { size: '30', chestInches: 30.0, chestCm: 76, lengthCm: 92, waistCm: 68, approxAge: '9–10 Years' },
  '32': { size: '32', chestInches: 32.0, chestCm: 81, lengthCm: 98, waistCm: 72, approxAge: '10–11 Years' },
  '34': { size: '34', chestInches: 34.0, chestCm: 86, lengthCm: 104, waistCm: 76, approxAge: '11–12 Years' },
  '36': { size: '36', chestInches: 36.0, chestCm: 91, lengthCm: 110, waistCm: 80, approxAge: '12–13 Years' },
  '38': { size: '38', chestInches: 38.0, chestCm: 96, lengthCm: 114, waistCm: 84, approxAge: '13–14 Years' },
  '40': { size: '40', chestInches: 40.0, chestCm: 102, lengthCm: 118, waistCm: 88, approxAge: '14–15 Years' },
};

/**
 * Returns the market standard chest, length, and waist measurements for any given size (16 to 40).
 */
export function getStandardMeasurement(size: string): SizeStandard {
  const standard = MARKET_SIZE_STANDARDS[size as ClothSize];
  if (standard) return standard;

  // Fallback estimation if custom size entered
  const numeric = parseInt(size, 10) || 24;
  return {
    size: size as ClothSize,
    chestInches: numeric,
    chestCm: Math.round(numeric * 2.54),
    lengthCm: Math.round(36 + (numeric - 16) * 3.4),
    waistCm: Math.round(numeric * 2.54 - 4),
    approxAge: '',
  };
}

/**
 * Creates a new SizeVariant with default stock of 1 and auto-populated market standard chest & length.
 */
export function createSizeVariant(
  size: string,
  price: number = 1290,
  mrp: number = 1690,
  productPrefix: string = 'JS'
): SizeVariant {
  const std = getStandardMeasurement(size);
  const cleanPrefix = productPrefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'JS';
  
  return {
    size,
    sku: `${cleanPrefix}-${Date.now().toString().slice(-4)}-${size}`,
    stock: 1, // Default to 1 on selection as requested
    price,
    mrp,
    chestCm: std.chestCm,
    lengthCm: std.lengthCm,
    waistCm: std.waistCm,
  };
}
