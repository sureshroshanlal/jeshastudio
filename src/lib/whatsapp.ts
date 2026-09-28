import { Product, SizeVariant } from '@/types';

export const JESHA_WHATSAPP_NUMBER = '919876543210'; // Jesha Studio official concierge number

export interface WhatsAppOrderPayload {
  product: Product;
  selectedVariant: SizeVariant;
  quantity?: number;
  childAge?: string;
  childHeightCm?: number;
  childBuild?: string;
  customerNote?: string;
}

export function generateProductOrderUrl({
  product,
  selectedVariant,
  quantity = 1,
  childAge,
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

  if (childAge || childHeightCm || childBuild) {
    message += `\n👶 *Child Details for Fit Verification:*\n`;
    if (childAge) message += `• Age: ${childAge}\n`;
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
  age?: number | string,
  heightCm?: number | string,
  build?: string
): string {
  let message = `🌸 *Hello Jesha Studio Atelier!* 🌸\n\n`;
  message += `I need personalized help choosing the perfect size for my child.\n\n`;

  if (productName) {
    message += `👗 *Product of Interest:* ${productName}\n`;
  }
  if (age) {
    message += `👶 *Child's Age:* ${age} years old\n`;
  }
  if (heightCm) {
    message += `📏 *Child's Height:* ${heightCm} cm\n`;
  }
  if (build) {
    message += `✨ *Approximate Build:* ${build}\n`;
  }

  message += `\nCould you please suggest the most comfortable, flattering size? Thank you!`;

  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateGeneralConciergeUrl(): string {
  const message = `🌿 *Hello Jesha Studio!* 🌿\n\nI am browsing your collection and would love to ask a quick question regarding designs and custom styling recommendations.`;
  return `https://wa.me/${JESHA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
