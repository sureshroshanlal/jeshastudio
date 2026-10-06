import { Product, SizeVariant } from '@/types';

export const JESHA_WHATSAPP_NUMBER = '919985531519'; // Jesha Studio primary WhatsApp
export const JESHA_WHATSAPP_NUMBER_2 = '918522091817'; // Jesha Studio secondary WhatsApp

export const JESHA_PHONE_1_DISPLAY = '+91 99855 31519';
export const JESHA_PHONE_2_DISPLAY = '+91 85220 91817';
export const JESHA_STUDIO_ADDRESS = 'Jesha Studio, Hyderabad, Telangana';
export const JESHA_STUDIO_EMAIL = 'contact@jeshastudio.com';

export interface WhatsAppOrderPayload {
  product: Product;
  selectedVariant: SizeVariant;
  quantity?: number;
  childChestInches?: number | string;
  childHeightCm?: number;
  childBuild?: string;
  customerNote?: string;
}

export function generateProductOrderUrl({
  product,
  selectedVariant,
  quantity = 1,
  childChestInches,
  childHeightCm,
  childBuild,
  customerNote,
}: WhatsAppOrderPayload): string {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  let message = `✨ *Hello Jesha Studio!* ✨\n\n`;
  message += `I would like to order this piece for my child:\n\n`;
  message += `👗 *Product:* ${product.name}\n`;
  message += `🏷️ *SKU:* ${selectedVariant.sku}\n`;
  message += `📏 *Size:* ${selectedVariant.size}\n`;
  message += `🔢 *Quantity:* ${quantity}\n`;
  message += `💰 *Price:* ₹${selectedVariant.price * quantity}\n`;

  if (childChestInches || childHeightCm || childBuild) {
    message += `\n👶 *Child Measurements for Fit Verification:*\n`;
    if (childChestInches) message += `• Chest: ${childChestInches} inches\n`;
    if (childHeightCm) message += `• Height: ${childHeightCm} cm\n`;
    if (childBuild) message += `• Build: ${childBuild}\n`;
  }

  if (customerNote) {
    message += `\n📝 *Special Note / Date required:* ${customerNote}\n`;
  }

  if (currentUrl) {
    message += `\n🔗 *Link:* ${currentUrl}\n`;
  }

  message += `\nPlease confirm availability and payment details (UPI/Bank Transfer). Thank you!`;

  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateFitAssistanceUrl(
  productName?: string,
  chestInches?: number | string,
  heightCm?: number | string,
  build?: string
): string {
  let message = `🌸 *Hello Jesha Studio!* 🌸\n\n`;
  message += `I need personalized help choosing the perfect size for my child.\n\n`;

  if (productName) {
    message += `👗 *Product of Interest:* ${productName}\n`;
  }
  if (chestInches) {
    message += `📐 *Child's Chest:* ${chestInches} inches\n`;
  }
  if (heightCm) {
    message += `📏 *Child's Height:* ${heightCm} cm\n`;
  }
  if (build) {
    message += `✨ *Approximate Build:* ${build}\n`;
  }

  message += `\nCould you please suggest the most comfortable, flattering size (Sizes 16 to 40)? Thank you!`;

  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralConciergeUrl(): string {
  const message = `🌸 *Hello Jesha Studio!* 🌸\n\nI am browsing your kids collection and would love to ask a question regarding sizing, availability, and placing an order.`;
  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateTryOnOrderUrl({
  product,
  selectedVariant,
  childNote,
}: {
  product: Product;
  selectedVariant: SizeVariant;
  childNote?: string;
}): string {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  let message = `✨ *Hello Jesha Studio!* ✨\n\n`;
  message += `I just tried *${product.name}* (Size ${selectedVariant.size}) on my child in your *Virtual Try-On Studio* and love the look! 🌸\n\n`;
  message += `👗 *Design:* ${product.name}\n`;
  message += `📏 *Size Selected:* ${selectedVariant.size}\n`;
  message += `💰 *Price:* ₹${selectedVariant.price}\n`;

  if (childNote) {
    message += `👶 *Child Notes:* ${childNote}\n`;
  }

  if (currentUrl) {
    message += `🔗 *Product Link:* ${currentUrl}\n`;
  }

  message += `\nI saved our Try-On snapshot to share with you. Please let me know how to proceed with the order! Thank you!`;

  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

